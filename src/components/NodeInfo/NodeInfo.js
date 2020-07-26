import React from 'react'

const NodeInfo = (props) => {

    return props.selectedNodeId && <div>
        <div>Id: {props.nodeData.id}</div>
        <div>Hierarchical level: {props.nodeData.hierarchy}</div>
        <div>Label: {props.nodeData.label}</div>
        <div>From: {props.nodeData.from.join(', ')}</div>
        <div>To: {props.nodeData.to.join(', ')}</div>
    </div>
}

export default NodeInfo
