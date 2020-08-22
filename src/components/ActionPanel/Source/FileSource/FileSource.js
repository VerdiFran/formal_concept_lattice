import React, {useState} from 'react'
import {Upload, message, Button, Typography} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import styles from './FileSource.module.scss'

const FileSource = ({loadFile, deleteErrors}) => {
    const [file, setFile] = useState('')
    const [fileFieldIsNotEmpty, setFileFieldIsNotEmpty] = useState(false)

    const {Dragger} = Upload
    const {Text, Paragraph} = Typography

    return <div className={styles.container}>
        <Paragraph type='secondary'>or</Paragraph>
        <Text>Upload file</Text>
        <Dragger
            className={styles.dragger}
            accept='.txt,.csv'
            showUploadList={false}
            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
            onChange={(info) => {
                const {status} = info.file
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`)
                    setFile(info.file.originFileObj)
                    setFileFieldIsNotEmpty(true)
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`)
                }
            }}>
            <UploadOutlined/>
            <p>Click or drag one file to upload</p>
            <p>Support TXT or CSV files</p>
        </Dragger>
        <Button
            type='primary'
            disabled={!fileFieldIsNotEmpty}
            onClick={() => {
                deleteErrors()
                loadFile(file)
            }}>Build a graph using this file
        </Button>
    </div>
}

export default FileSource
