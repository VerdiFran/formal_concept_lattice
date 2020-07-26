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

export const getSelectedNodeData = (state) => {
    if (state.graph.selectedNodeId) {
        const nodeId = state.graph.selectedNodeId
        const nodeIdsFrom = state.graph.graph.edges.filter(edge => edge.to === nodeId).map(edge => edge.from)
        const nodeIdsTo = state.graph.graph.edges.filter(edge => edge.from === nodeId).map(edge => edge.to)

        const nodeLabel = state.graph.graph.nodes.find(node => node.id === nodeId).label
        const nodesFrom = state.graph.graph.nodes.filter(node => nodeIdsFrom.includes(node.id)).map(node => node.label)
        const nodesTo = state.graph.graph.nodes.filter(node => nodeIdsTo.includes(node.id)).map(node => node.label)

        return {
            label: nodeLabel,
            from: nodesFrom,
            to: nodesTo,
            id: nodeId,
            hierarchy: state.graph.graph.nodes.find(node => node.id === nodeId).level
        }
    }
}

export const getText = (state) => state.fileLoader.text
