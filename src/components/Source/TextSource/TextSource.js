import React, {useEffect, useState} from 'react'

const TextSource = ({sourceText, setText, deleteText, loadText}) => {
        return <div>
        <textarea
            value={sourceText}
            onChange={(e) => setText(e.currentTarget.value)}
        />
        <button onClick={deleteText}>Clear</button>
        <button onClick={() => loadText(sourceText)}>Load this text</button>
    </div>
}

export default TextSource
