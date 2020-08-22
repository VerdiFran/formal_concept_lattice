export const getGraphData = (state) => {
    return {
        ...state.graph.graph,
        nodes: state.graph.graph.nodes,
        edges: state.graph.graph.edges
    }
}

export const getGraphKey = (state) => {
    return state.graph.graphKey
}

export const getIsSaving = (state) => {
    return state.graph.isSaving
}

export const getSelectedNode = (state) => state.graph.selectedNodeId

export const getSelectedNodeData = (state) => {
    if (state.graph.selectedNodeId) {
        const nodeId = state.graph.selectedNodeId
        const nodeLabel = state.graph.graph.nodes.find(node => node.id === nodeId).label
        const attributes = state.graph.attributes.find(node => node.id === nodeId).attributes

        return {
            label: nodeLabel,
            attributes
        }
    }
}

export const getDataIsLoaded = (state) => {
    return state.fileLoader.fileIsLoaded || state.fileLoader.textIsLoaded
}

export const getErrors = (state) => {
    return state.fileLoader.errors
}

export const getText = (state) => state.fileLoader.text

export const getTextFieldIsNotEmpty = (state) => state.fileLoader.textFieldIsNotEmpty
