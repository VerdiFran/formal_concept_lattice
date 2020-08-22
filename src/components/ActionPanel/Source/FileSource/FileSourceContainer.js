import {connect} from 'react-redux'
import {deleteErrors, loadFile} from '../../../../redux/reducers/fileLoadingReducer'
import FileSource from './FileSource'

export default connect(null, {loadFile, deleteErrors})(FileSource)
