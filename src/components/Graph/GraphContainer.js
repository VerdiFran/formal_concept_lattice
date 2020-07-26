import React, {useState} from 'react'
import {connect} from 'react-redux'
import Graph from 'react-graph-vis'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import C2S from '@bokeh/canvas2svg'
import {getGraphData, getGraphKey} from '../../selectors/selectors'
import {setSelectedNode} from '../../redux/reducers/graphReducer'

const GraphContainer = (props) => {
    const [network, setNetwork] = useState(null)

    const options = {
        physics: {
            enabled: false,
            stabilization: false,
        },
        layout: {
            hierarchical: {
                enabled: true,
                nodeSpacing: 200,
                levelSeparation: 130
            }
        },
        edges: {
            smooth: {
                enabled: true,
                type: 'cubicBezier'
            },
            color: '#333333',
            width: 2.0,
            arrows: {
                to: {
                    enabled: false,
                    scaleFactor: 0.5
                }
            }
        },
        nodes: {
            color: {
                background: '#cccccc',
                border: '#ffffff00'
            },
            shape: 'ellipse',
            font: {
                size: 24,
                align: 'center'
            },
            borderWidth: 0,
            borderWidthSelected: 0,
            widthConstraint: {
                minimum: 30
            },
            heightConstraint: {
                minimum: 30
            }
        },
        height: '500px'
    }

    const events = {
        selectNode: (event) => {
            const {nodes, edges} = event

            props.setSelectedNode(nodes[0])
        },
        deselectNode: (event) => {
            const {nodes, edges} = event

            props.setSelectedNode(null)
        },
        dragStart: (event) => {
            const {nodes, edges} = event

            nodes[0] && props.setSelectedNode(nodes[0])
        },
        beforeDrawing: (event) => {

        }
    }

    const printDocument = async () => {
        const input = document.getElementsByTagName('canvas')[0]

        /*await network.moveTo({
            position: {x: 0, y: 0},
            scale: 0.5,
            offset: {x: 200, y: 0}
        })
*/

        html2canvas(input, {
            scale: 1.0
        }).then((canvas) => {
            let imgData = canvas.toDataURL('image/png', 1.0)

            let pdf = new jsPDF({
                orientation: 'l',
                format: [1000, 500]
            })

            const w = window.open('about:blank', 'image from canvas')
            w.document.write('<img src=\'' + imgData + '\' alt=\'from canvas\'/>')

            pdf.addImage(imgData, 'PNG', 0, 0)
            pdf.save('download.pdf')
        })
    }

    const printFromDOM = () => {
        if (network) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    network.moveTo({
                        scale: 0.5,
                        offset: {x: i * 300, y: j * 300},
                        animation: {
                            duration: 5000,
                            easingFunction: 'easeInOutQuart'
                        }
                    })
                }
            }
        }
    }

    return (
        <div>
            <div>
                <button onClick={printDocument}>Print</button>
            </div>
            <Graph
                key={props.graphKey}
                graph={props.graph}
                identifier={`g${props.graphKey}`}
                options={options}
                events={events}
                getNetwork={network => setNetwork(network)}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    graph: getGraphData(state),
    graphKey: getGraphKey(state)
})

export default connect(mapStateToProps, {setSelectedNode})(GraphContainer)
