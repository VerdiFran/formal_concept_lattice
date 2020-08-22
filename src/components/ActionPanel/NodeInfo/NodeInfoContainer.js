import React from 'react'
import NodeInfo from './NodeInfo'
import {connect} from 'react-redux'
import {getSelectedNode, getSelectedNodeData} from '../../../selectors/selectors'

const mapStateToProps = (state) => ({
    nodeData: getSelectedNodeData(state),
    selectedNodeId: getSelectedNode(state)
})

export default connect(mapStateToProps, null)(NodeInfo)
