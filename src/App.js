import React from 'react'
import './App.css'
import GraphContainer from './components/Lattice/LatticeContainer'
import {Provider} from 'react-redux'
import store from './redux/store'
import ActionPanel from './components/ActionPanel/ActionPanel'
import ErrorMessagesContainer from './components/ErrorMessages/ErrorMessagesContainer'

const App = () => {
    return (
        <Provider store={store}>
            <div className="App">
                <GraphContainer/>
                <ErrorMessagesContainer/>
                <ActionPanel/>
            </div>
        </Provider>
    )
}

export default App
