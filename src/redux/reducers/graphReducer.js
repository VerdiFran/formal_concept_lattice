const SET_SELECTED_NODE = 'SET-SELECTED-NODE'
const SET_GRAPH_DATA = 'SET-GRAPH-DATA'
const TOGGLE_IS_SAVING = 'TOGGLE-IS-SAVING'
const SET_NODE_ATTRIBUTES = 'SET-NODE-ATTRIBUTES'

const initialState = {
    graph: {
        nodes: [],
        edges: []
    },
    attributes: [],
    selectedNodeId: null,
    graphKey: 0,
    dataWasSet: false,
    isSaving: false
}

const graphReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_NODE:
            return {
                ...state,
                selectedNodeId: action.value
            }
        case SET_GRAPH_DATA:
            return {
                ...state,
                graph: {
                    nodes: [...action.data.nodes],
                    edges: [...action.data.edges]
                },
                graphKey: state.graphKey + 1,
                dataWasSet: true
            }
        case TOGGLE_IS_SAVING:
            return {
                ...state,
                isSaving: action.value
            }
        case SET_NODE_ATTRIBUTES:
            return {
                ...state,
                attributes: action.attributes
            }
        default:
            return state
    }
}

export const setSelectedNode = (value) => ({type: SET_SELECTED_NODE, value})
export const setGraphData = (data) => ({type: SET_GRAPH_DATA, data})
export const toggleIsSaving = (value) => ({type: TOGGLE_IS_SAVING, value})
export const setNodeAttributes = (attributes) => ({type: SET_NODE_ATTRIBUTES, attributes})

export default graphReducer
