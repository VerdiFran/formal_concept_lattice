import React from 'react'
import NodeInfoContainer from './NodeInfo/NodeInfoContainer'
import Source from './Source/Source'
import {Collapse} from 'antd'
import styles from './ActionPanel.module.scss'

const ActionPanel = () => {
    const {Panel} = Collapse

    return (
        <Collapse
            className={styles.container}
            bordered={false}
            defaultActiveKey={['1']}>
            <Panel header="Data" key="1">
                <Source/>
            </Panel>
            <Panel header="About node" key="2">
                <NodeInfoContainer/>
            </Panel>
        </Collapse>
    )
}

export default ActionPanel
