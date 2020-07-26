import React from 'react'
import './App.css'
import GraphContainer from './components/Graph/GraphContainer'
import {Provider} from 'react-redux'
import store from './redux/store'
import NodeInfoContainer from './components/NodeInfo/NodeInfoContainer'
import Source from './components/Source/Source'

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Source />
                <GraphContainer />
                <NodeInfoContainer />
            </div>
        </Provider>
    )
}

export default App
