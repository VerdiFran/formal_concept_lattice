import React from 'react'
import {Alert} from 'antd'
import styles from './ErrorMessages.module.scss'
import 'antd/dist/antd.css'

const ErrorMessages = ({errors, deleteErrors}) => {
    return errors.length > 0 && <div className={styles.container}>
        {
            errors.map(error => <div key={error.id}>
                <Alert
                    message="Error"
                    description={error.message}
                    type="error"
                    closable
                    showIcon
                    onClose={() => deleteErrors([error.id])}
                />
            </div>)
        }
    </div>
}

export default ErrorMessages