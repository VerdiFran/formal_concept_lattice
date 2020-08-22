import React, {useState} from 'react'
import {connect} from 'react-redux'
import Lattice from './Lattice'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {getDataIsLoaded, getGraphData, getGraphKey, getIsSaving} from '../../selectors/selectors'
import {setSelectedNode, toggleIsSaving} from '../../redux/reducers/graphReducer'
import 'antd/dist/antd.css'

const LatticeContainer = (props) => {
    const [network, setNetwork] = useState(null)
    const [tooltipPos, setTooltipPos] = useState({x: null, y: null})
    const [tooltipTitle, setTooltipTitle] = useState(null)

    const options = {
        physics: {
            enabled: false,
            stabilization: false,
        },
        layout: {
            hierarchical: {
                enabled: true,
                nodeSpacing: 300,
                levelSeparation: 160
            }
        },
        interaction: {
            hover: true
        },
        edges: {
            smooth: {
                enabled: true,
                type: 'cubicBezier'
            },
            color: {
                color: '#8a8a8a',
                highlight: '#000000',
                hover: '#000000'
            },
            width: 3.0,
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
                border: '#ffffff00',
                highlight: {
                    border: '#000000',
                    background: '#ffffff'
                },
                hover: {
                    border: '#000000',
                    background: '#ffffff'
                }
            },
            shape: 'ellipse',
            font: {
                size: 24,
                align: 'center'
            },
            borderWidth: 1,
            borderWidthSelected: 2,
            widthConstraint: {
                minimum: 30
            },
            heightConstraint: {
                minimum: 30
            }
        },
        width: '100%',
        height: '100%'
    }

    const events = {
        selectNode: (event) => {
            const {nodes} = event

            props.setSelectedNode(nodes[0])
        },
        deselectNode: () => {
            props.setSelectedNode(null)
        },
        dragStart: (event) => {
            const {nodes} = event

            nodes[0] && props.setSelectedNode(nodes[0])
        },
        hoverNode: (event) => {
            const nodeId = event.node
            if (nodeId) {
                const nodeTitle = props.graph.nodes.find(node => node.id === nodeId).title
                setTooltipTitle(nodeTitle)

                const position = network.canvasToDOM(network.getPositions([nodeId])[nodeId])
                setTooltipPos(position)
            }
        },
        blurNode: () => {
            setTooltipTitle(null)
        }
    }

    const printDocument = () => {
        props.toggleIsSaving(true)

        const height = Math.max.apply(null, props.graph.nodes.map(node => node.level)) * 160 * 2
        const left = Math.min.apply(null, props.graph.nodes.map(node => network.getPositions(node.id)[node.id].x))
        const right = Math.max.apply(null, props.graph.nodes.map(node => network.getPositions(node.id)[node.id].y))
        const width = (right - left + 30) * 2

        network.unselectAll()
        network.fit()
        network.setSize(`${width}px`, `${height}px`)
        network.redraw()

        const input = document.getElementsByTagName('canvas')[0]

        html2canvas(input, {
            scale: 1.0
        }).then((canvas) => {
            let pdf = new jsPDF({
                orientation: 'l',
                format: [width * 0.75, height * 0.75]
            })

            let imgData = canvas.toDataURL('image/jpeg', 1.0)

            pdf.addImage(imgData, 'JPEG', 0, 0)
            pdf.save('download.pdf')

            network.setSize('100%', '100%')
            network.redraw()
            network.fit()

            props.toggleIsSaving(false)
        })
    }

    window.addEventListener('resize', function () {
        if (network) network.redraw()
    })

    return <Lattice options={options}
                    events={events}
                    tooltipPos={tooltipPos}
                    tooltipTitle={tooltipTitle}
                    printDocument={printDocument}
                    setNetwork={setNetwork}
                    setTooltipPos={setTooltipPos}
                    setTooltipTitle={setTooltipTitle}
                    {...props}/>
}

const mapStateToProps = (state) => ({
    graph: getGraphData(state),
    graphKey: getGraphKey(state),
    dataIsLoaded: getDataIsLoaded(state),
    isSaving: getIsSaving(state)
})

export default connect(mapStateToProps, {setSelectedNode, toggleIsSaving})(LatticeContainer)
