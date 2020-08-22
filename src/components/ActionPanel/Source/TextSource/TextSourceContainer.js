import TextSource from './TextSource'
import {connect} from 'react-redux'
import {deleteErrors, deleteText, loadText, setText} from '../../../../redux/reducers/fileLoadingReducer'
import {getText, getTextFieldIsNotEmpty} from '../../../../selectors/selectors'

const mapStateToProps = (state) => ({
    sourceText: getText(state),
    textFieldIsNotEmpty: getTextFieldIsNotEmpty(state)
})

export default connect(mapStateToProps, {setText, loadText, deleteText, deleteErrors})(TextSource)
