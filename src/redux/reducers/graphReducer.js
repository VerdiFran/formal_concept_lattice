const SET_SELECTED_NODE = 'SET-SELECTED-NODE'
const SET_GRAPH_DATA = 'SET-GRAPH-DATA'

const initialState = {
    graph: {
        nodes: [],
        edges: []
    },
    selectedNodeId: null,
    graphKey: 0
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
                graphKey: state.graphKey + 1
            }
        default:
            return state
    }
}

export const setSelectedNode = (value) => ({type: SET_SELECTED_NODE, value})
export const setGraphData = (data) => ({type: SET_GRAPH_DATA, data})

export default graphReducer
