import {setGraphData} from './graphReducer'

const SET_TEXT = 'SET-TEXT'
const SET_FILE_TEXT = 'SET-FILE-TEXT'
const ADD_ERROR = 'ADD-ERROR'
const DELETE_ERRORS = 'DELETE-ERRORS'
const DELETE_TEXT = 'DELETE-TEXT'
const SET_TEXT_TYPE = 'SET-TEXT-TYPE'
const CSV = 'CSV'
const TXT = 'TXT'

const initialState = {
    text: '"1257141, 1257028",the, 18.0\n' +
        '1257791, "опрос, мусор", 19.0',
    fileText: '',
    fileIsLoaded: false,
    textIsLoaded: false,
    textType: '',
    errors: []
}

const fileLoadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TEXT:
            return {
                ...state,
                text: action.text
            }
        case SET_FILE_TEXT:
            return {
                ...state,
                fileText: action.text
            }
        case ADD_ERROR:
            return {
                ...state,
                errors: [...state.errors, action.errorMessage]
            }
        case DELETE_ERRORS:
            return {
                ...state,
                errors: []
            }
        case DELETE_TEXT:
            return {
                ...state,
                text: ''
            }
        case SET_TEXT_TYPE:
            return {
                ...state,
                textType: action.textType
            }
        default:
            return state
    }
}

export const setText = (text) => ({type: SET_TEXT, text})
const setFileText = (text) => ({type: SET_FILE_TEXT, text})
const setTextType = (textType) => ({type: SET_TEXT_TYPE, textType})

export const deleteText = () => ({type: DELETE_TEXT})
export const addError = (errorMessage) => ({type: ADD_ERROR, errorMessage})
export const deleteErrors = () => ({type: DELETE_ERRORS})

export const loadText = (text) => (dispatch) => {
    dispatch(setText(text))

    let textType = /[[]]/.test(text) ? TXT : CSV

    dispatch(setTextType(textType))

    let arr = textType === CSV ? parseFromCsv(text) : parseFromTxt(text)

    let emptyAttrCount = 0
    let emptyObjCount = 0

    arr.forEach(item => {
        item.attributes.length === 0 && emptyAttrCount++
        item.objects.length === 0 && emptyObjCount++
    })

    emptyAttrCount > 1 && dispatch(addError('Пустые аттрибуты'))
    emptyObjCount > 1 && dispatch(addError('Пустые объекты'))

    let graphData = convertToGraphData(arr)

    dispatch(setGraphData(graphData))
}

export const loadFile = (file) => (dispatch) => {
    let fileReader = new FileReader()
    let textFile = /text.*/

    if (file.type.match(textFile)) {
        fileReader.onload = function (event) {
            let text = event.target.result

            dispatch(setFileText(text))

            let textType = /[[]]/.test(text) ? TXT : CSV

            dispatch(setTextType(textType))

            let arr = textType === CSV ? parseFromCsv(text) : parseFromTxt(text)

            let emptyAttrCount = 0
            let emptyObjCount = 0

            arr.forEach(item => {
                item.attributes.length === 0 && emptyAttrCount++
                item.objects.length === 0 && emptyObjCount++
            })

            emptyAttrCount > 1 && dispatch(addError('Пустые аттрибуты'))
            emptyObjCount > 1 && dispatch(addError('Пустые объекты'))

            let graphData = convertToGraphData(arr)

            dispatch(setGraphData(graphData))
        }
    } else {
        dispatch(addError('Неверный формат файла'))
    }

    fileReader.readAsText(file, 'Windows-1251')
}

const removeSpaces = (s) => {
    return s.replace(/("[^"]*")|([ \t]+)/g, (x) => {
        return x.charCodeAt(0) === 34 ? x : ''
    })
}

const parseFromCsv = async (text) => {
    let strArr = await text.split('\n')
        .filter(str => str !== '')
        .map((row, idx) => {

            // examples:

            // "1257141, 1257028",the, 18.0
            // 1257791, "опрос, мусор", 19.0

            let newRow = removeSpaces(row)
            console.log(newRow)
        })

    return Array.from(strArr)
}

const parseFromTxt = async (text) => {
    let strArr = await text.split('\n')
        .filter(str => str !== '')
        .map((row, index) => {
            let newRow = row.replace(/['( )"]/g, '')
            let startOfFirstParam = 1
            let endOfFirstParam = newRow.indexOf(']')
            let startOfSecondParam = newRow.indexOf('[', endOfFirstParam) + 1
            let endOfSecondParam = newRow.indexOf(']', startOfSecondParam)

            let objParams = {
                attributes: startOfFirstParam !== endOfFirstParam
                    ? newRow.slice(1, endOfFirstParam).split(',').map(item => +item)
                    : [],
                objects: startOfSecondParam !== endOfSecondParam
                    ? newRow.slice(startOfSecondParam, endOfSecondParam).split(',')
                    : [],
                colorValue: +newRow.slice(endOfSecondParam + 2)
            }

            return {
                id: index,
                ...objParams
            }
        })

    return Array.from(strArr)
}

const convertToGraphData = (objArr) => {
    let info = getDataInfo(objArr)
    let nodes = []
    let edges = []
    let levels = new Map()

    objArr.forEach((item) => {
        let parents = getParents(item, objArr)
        let sortedItems = [...parents].sort((a, b) => a.objects.length - b.objects.length)
        let level = sortedItems.length > 0
            ? Math.max.apply(null, sortedItems.map(el => levels.get(el.id))) + Math.floor(Math.random() * 2.5) + 1
            : 0
        levels.set(item.id, level)
    })

    objArr.forEach((item) => {
        let allChildren = []
        let excludedChildren = []
        let nearestChildren = []

        let children = getChildren(item, objArr)

        if (children.length > 0) {
            allChildren = children.sort((a, b) => a.objects.length - b.objects.length)
            excludedChildren = []
            nearestChildren = allChildren

            allChildren.forEach((neighbour, index) => {
                for (let idx = index + 1; idx < allChildren.length; idx++) {
                    if (index !== idx
                        && neighbour.objects.every(value => allChildren[idx].objects.includes(value))
                        && !excludedChildren.includes(allChildren[idx])) {

                        excludedChildren.push(allChildren[idx])
                    }
                }
            })

            if (excludedChildren.length > 0) {
                nearestChildren = allChildren.filter(neighbour => !excludedChildren.includes(neighbour))
            } else if (excludedChildren.length === 1) {
                nearestChildren = excludedChildren.map(item => ({...item}))
            }
        }

        nodes.push({
            id: item.id,
            label: item.id === info.endId ? ' ' : item.objects.join(', '),
            title: item.objects.join(', '),
            level: levels.get(item.id),
            color: {
                background: getColor(item.colorValue, info.minColorValue, info.maxColorValue)
            }
        })

        for (let nearestChild of nearestChildren) {
            edges.push({
                from: item.id,
                to: nearestChild.id
            })
        }
    })

    return {
        nodes: nodes.filter((item, index) => nodes.findIndex(elem => elem.label === item.label) === index),
        edges: edges.filter((item, index) => edges.findIndex(elem => elem.from === item.from && elem.to === item.to) === index)
    }
}

const getDataInfo = (data) => {
    let maxObjCount = Math.max.apply(null, data.map(item => item.objects.length))
    let maxLevel = Math.max.apply(null, data.map(item => item.objects.length).filter(item => item < maxObjCount))

    let startId = data.find(item => item.objects.length === 0).id
    let endId = data.find(item => item.objects.length === maxObjCount).id

    return {
        endId,
        startId,
        minColorValue: Math.min.apply(null, data.map(item => item.colorValue)),
        maxColorValue: Math.max.apply(null, data.map(item => item.colorValue)),
        maxLevel,
        minLevel: 0
    }
}

const getChildren = (elem, objArr) => objArr.filter((item) =>
    elem.objects.every(value => item.objects.includes(value)) && item.objects.length !== elem.objects.length)

const getParents = (elem, objArr) => objArr.filter(item =>
    item.objects.every(value => elem.objects.includes(value))
    && elem.id !== item.id
    && item.objects.length !== elem.objects.length)

const getColor = (coefficient, min, max) => {
    const colors = [
        'rgb(255,0,0)',
        'rgb(255,63,0)',
        'rgb(255,95,0)',
        'rgb(191,255,0)',
        'rgb(159,255,0)',
        'rgb(255,31,0)',
        'rgb(127,255,0)',
        'rgb(255,127,0)',
        'rgb(63,255,0)',
        'rgb(255,159,0)',
        'rgb(223,255,0)',
        'rgb(95,255,0)',
        'rgb(31,255,0)',
        'rgb(255,191,0)',
        'rgb(255,223,0)',
        'rgb(0,255,0)',
        'rgb(255,255,0)'
    ]

    let step = (max - min) / (colors.length - 1)
    let index = Math.round((coefficient - min) / step)

    return colors[index]
}

export default fileLoadingReducer
