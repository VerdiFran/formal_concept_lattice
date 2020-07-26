import {connect} from 'react-redux'
import NodeInfo from './NodeInfo'
import {getSelectedNodeData} from '../../selectors/selectors'
import React from 'react'

const mapStateToProps = (state) => ({
    nodeData: getSelectedNodeData(state),
    selectedNodeId: state.graph.selectedNodeId
})

export default connect(mapStateToProps, {})(NodeInfo)
