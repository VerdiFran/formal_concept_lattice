import {setGraphData, setNodeAttributes} from './graphReducer'
import {convertToGraphData, parseCsv, parseTxt} from '../../utils/parsers/textParsers'

const SET_TEXT = 'SET-TEXT'
const SET_FILE_TEXT = 'SET-FILE-TEXT'
const ADD_ERROR = 'ADD-ERROR'
const DELETE_ERRORS = 'DELETE-ERRORS'
const DELETE_TEXT = 'DELETE-TEXT'
const SET_TEXT_TYPE = 'SET-TEXT-TYPE'
const CSV = 'CSV'
const TXT = 'TXT'

const initialState = {
    text: '',
    fileText: '',
    textFieldIsNotEmpty: false,
    fileFieldIsNotEmpty: false,
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
                text: action.text,
                textFieldIsNotEmpty: action.text.length > 0
            }
        case SET_FILE_TEXT:
            return {
                ...state,
                fileText: action.text,
                fileIsLoaded: true
            }
        case ADD_ERROR:
            return {
                ...state,
                errors: [
                    ...state.errors,
                    {id: action.messageId, message: action.errorMessage}
                ]
            }
        case DELETE_ERRORS:
            return {
                ...state,
                errors: action.messageIds
                    ? state.errors.filter(error => !action.messageIds.includes(error.id))
                    : []
            }
        case DELETE_TEXT:
            return {
                ...state,
                text: '',
                textFieldIsNotEmpty: false
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
export const deleteText = () => ({type: DELETE_TEXT})
export const addError = (messageId, errorMessage) => ({type: ADD_ERROR, messageId, errorMessage})
export const deleteErrors = (messageIds) => ({type: DELETE_ERRORS, messageIds})

const setFileText = (text) => ({type: SET_FILE_TEXT, text})
const setTextType = (textType) => ({type: SET_TEXT_TYPE, textType})

function* errMessageIdGenerator() {
    let id = 0
    for (; ; id++) {
        yield id
    }
}
const errMessageIdIterator = errMessageIdGenerator()

export const loadText = (text) => (dispatch) => {
    dispatch(setText(text))

    readText(text, dispatch)
}

export const loadFile = (file) => (dispatch) => {
    const fileReader = new FileReader()

    fileReader.onload = function (event) {
        const text = event.target.result

        readText(text, dispatch)
    }

    fileReader.readAsText(file, 'Windows-1251')
}

const readText = (text, dispatch) => {
    dispatch(setFileText(text))

    const textType = /[[]]/.test(text) ? TXT : CSV

    dispatch(setTextType(textType))

    const objArr = textType === CSV ? parseCsv(text) : parseTxt(text)

    dispatch(setNodeAttributes(objArr.map(elem => ({id: elem.id, attributes: elem.attributes}))))

    try {
        const graphData = convertToGraphData(objArr)
        dispatch(setGraphData(graphData))
    } catch {
        dispatch(addError(errMessageIdIterator.next().value, 'Data is not correct.'))
    }
}

export default fileLoadingReducer
