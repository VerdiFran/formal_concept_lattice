import TextSource from './TextSource'
import {connect} from 'react-redux'
import {deleteText, loadText, setText} from '../../../redux/reducers/fileLoadingReducer'
import {getText} from '../../../selectors/selectors'

const mapStateToProps = (state) => ({
    sourceText: getText(state)
})

export default connect(mapStateToProps, {setText, loadText, deleteText})(TextSource)
