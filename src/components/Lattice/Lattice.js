import React from 'react'
import Graph from 'react-graph-vis'
import styles from './LatticeContainer.module.scss'
import {Button} from 'antd'
import {VerticalAlignBottomOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css'

const Lattice = (props) => {
    return (
        <div className={styles.container}>
            {props.tooltipTitle &&
                <div id='tooltip' className={styles.tooltip}
                     style={{'--tooltip-x': `${props.tooltipPos.x}px`, '--tooltip-y': `${props.tooltipPos.y}px`}}
                >number of attributes: {props.tooltipTitle}</div>
            }
            <div className={styles.btnContainer}>
                <Button
                    className={styles.pdfButton}
                    onClick={props.printDocument}
                    disabled={!props.dataIsLoaded}
                    loading={props.isSaving}
                    icon={<VerticalAlignBottomOutlined/>}>Save as PDF</Button>
            </div>
            <Graph
                key={props.graphKey}
                graph={props.graph}
                identifier={`g${props.graphKey}`}
                options={props.options}
                events={props.events}
                getNetwork={network => props.setNetwork(network)}
            />
        </div>
    )
}

export default Lattice
