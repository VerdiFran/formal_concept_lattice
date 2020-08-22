import React from 'react'
import {Input, Button, Typography} from 'antd'
import styles from './TextSource.module.scss'

const TextSource = ({sourceText, textFieldIsNotEmpty, setText, deleteText, loadText, deleteErrors}) => {
    const {TextArea} = Input
    const {Text} = Typography

    const textPlaceholder = '([attributes], [objects], color_value)\nor\n"attributes", "objects", color_value'

    return <div>
        <Text>Upload text</Text>
        <TextArea
            className={styles.textarea}
            rows='5'
            value={sourceText}
            bordered='false'
            placeholder={textPlaceholder}
            onChange={(e) => setText(e.currentTarget.value)}
        />
        <Button
            className={styles.button}
            disabled={!textFieldIsNotEmpty}
            type='default'
            danger='true'
            onClick={deleteText}>Clear</Button>
        <Button
            className={styles.button}
            disabled={!textFieldIsNotEmpty}
            type='primary'
            onClick={() => {
            deleteErrors()
            loadText(sourceText)
        }}>Build a graph using this text</Button>
    </div>
}

export default TextSource
