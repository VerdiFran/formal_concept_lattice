import React, {useState} from 'react'

const FileSource = ({errors, loadFile, deleteErrors}) => {
    const [file, setFile] = useState('')

    return <>
        <div>
            <input type='file' onChange={e => {setFile(e.currentTarget.files[0])}}/>
            <button onClick={() => {
                loadFile(file)
                deleteErrors()
            }}>Start</button>
        </div>
        {
            errors.length > 0 && <div>
                {
                    errors.map((error, idx) => <div key={idx}>{error}</div>)
                }
            </div>
        }
    </>
}

export default FileSource
