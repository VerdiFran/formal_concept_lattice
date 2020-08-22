import React from 'react'
import styles from './NodeInfo.module.scss'

const NodeInfo = ({selectedNodeId, nodeData}) => {
    return selectedNodeId
        ? <div className={styles.container}>
            <div>
                <span>Label:</span> <span>{nodeData.label}</span>
            </div>
            <div>
                <span>Attributes:</span> <span>{nodeData.attributes.join(', ')}</span>
            </div>
        </div>
        : <div>Select node</div>
}

export default NodeInfo
