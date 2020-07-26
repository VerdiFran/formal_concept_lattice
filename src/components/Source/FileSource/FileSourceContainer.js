import {connect} from 'react-redux'
import {deleteErrors, loadFile} from '../../../redux/reducers/fileLoadingReducer'
import FileSource from './FileSource'

let mapStateToProps = (state) => ({
    errors: state.fileLoader.errors
})

export default connect(mapStateToProps, {loadFile, deleteErrors})(FileSource)
