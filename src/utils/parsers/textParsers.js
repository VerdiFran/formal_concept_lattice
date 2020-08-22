export const parseCsv = (text) => {
    const separator = /;/.test(text) ? ';' : ','
    const textWithoutSpaces = removeSpaces(text)
    const arr = csvToArray(textWithoutSpaces, separator)

    const objArr = arr.filter(item => item.length === 3)
        .map((item, idx) => ({
            id: idx + 1,
            attributes: item[0] ? item[0].split(',').map(attr => +attr) : [],
            objects: item[1] ? item[1].split(',').map(obj => removeSpaces(obj)) : [],
            colorValue: +item[2]
        }))

    return Array.from(objArr)
}

export const parseTxt = (text) => {
    const strArr = text.split('\n')
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
                id: index + 1,
                ...objParams
            }
        })

    return Array.from(strArr)
}

export const convertToGraphData = (elements) => {
    const nodes = []
    const edges = []

    const info = getDataInfo(elements)
    const levels = getLevels(elements)

    elements.forEach((element) => {
        let allChildren = []
        let excludedChildren = []
        let nearestChildren = []

        let children = getChildren(element, elements)

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
            id: element.id,
            label: element.id === info.endId ? ' ' : element.objects.join(', '),
            title: String(element.attributes.length),
            level: levels.get(element.id),
            color: {
                background: getColor(element.colorValue, info.minColorValue, info.maxColorValue)
            }
        })

        for (let nearestChild of nearestChildren) {
            edges.push({
                from: element.id,
                to: nearestChild.id,
                attributes: element.attributes
            })
        }
    })

    return {
        nodes: nodes.filter((node, index) => nodes.findIndex(elem => elem.label === node.label) === index),
        edges: edges.filter((edge, index) => edges.findIndex(elem => elem.from === edge.from && elem.to === edge.to) === index)
    }
}

const removeSpaces = (s) => {
    return s.replace(/("[^"]*")|([ \t]+)/g, (x) => {
        return x.charCodeAt(0) === 34 ? x : ''
    })
}

const csvToArray = (strData, strDelimiter) => {
    const objPattern = new RegExp(
        (
            '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +
            '(?:"([^"]*(?:""[^"]*)*)"|' +
            '([^\\' + strDelimiter + '\\r\\n]*))'
        ),
        'gi'
    )

    const arrData = [[]]
    let arrMatches = null

    while (arrMatches = objPattern.exec(strData)) {
        const strMatchedDelimiter = arrMatches[1]

        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([])
        }

        let strMatchedValue

        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"')
        } else {
            strMatchedValue = arrMatches[3]
        }

        arrData[arrData.length - 1].push(strMatchedValue)
    }

    return arrData
}

const getLevels = (objArr) => {
    const levels = new Map()
    const levelDiffCoefficient = 2.5

    objArr.forEach((item) => {
        let parents = getParents(item, objArr)
        let sortedParents = [...parents].sort((a, b) => a.objects.length - b.objects.length)
        let level = sortedParents.length > 0
            ? Math.max.apply(null, sortedParents.map(el => levels.get(el.id))) + Math.floor(Math.random() * levelDiffCoefficient) + 1
            : 0
        levels.set(item.id, level)
    })

    return levels
}

const getDataInfo = (data) => {
    let maxObjCount = Math.max.apply(null, data.map(item => item.objects.length))

    let startId = data.find(item => item.objects.length === 0).id || 0
    let endId = data.find(item => item.objects.length === maxObjCount).id || Math.max.apply(null, data.map(item => item.id))
    let minColorValue = Math.min.apply(null, data.map(item => item.colorValue))
    let maxColorValue = Math.max.apply(null, data.map(item => item.colorValue))

    return {
        endId,
        startId,
        minColorValue,
        maxColorValue
    }
}

const getChildren = (currentElem, objArr) => objArr.filter(elem =>
    currentElem.objects.every(value => elem.objects.includes(value)) && elem.objects.length !== currentElem.objects.length)

const getParents = (currentElem, objArr) => objArr.filter(elem =>
    elem.objects.every(value => currentElem.objects.includes(value))
    && currentElem.id !== elem.id
    && elem.objects.length !== currentElem.objects.length)

const getColor = (colorValue, min, max) => {
    const colors = [
        'rgba(217,54,146,0.9)',
        'rgba(210,126,61,0.9)',
        'rgba(73,200,76,0.9)',
        'rgba(178,73,191,0.9)',
        'rgba(152,196,70,0.9)',
        'rgba(161,77,191,0.9)',
        'rgba(214,81,81,0.9)',
        'rgba(212,143,80,0.9)',
        'rgba(111,214,78,0.9)',
        'rgba(215,157,62,0.9)',
        'rgba(210,231,62,0.9)',
        'rgba(60,208,180,0.9)',
        'rgba(227,72,156,0.9)',
        'rgba(202,166,62,0.9)',
    ]

    let step = (max - min) / (colors.length - 1)
    let index = Math.round((colorValue - min) / step)

    return colors[index]
}