import React from 'react'
import {connect} from 'react-redux'
import {deleteErrors} from '../../redux/reducers/fileLoadingReducer'
import 'antd/dist/antd.css'
import ErrorMessages from './ErrorMessages'
import {getErrors} from '../../selectors/selectors'

const mapStateToProps = (state) => ({
    errors: getErrors(state)
})

export default connect(mapStateToProps, {deleteErrors})(ErrorMessages)
