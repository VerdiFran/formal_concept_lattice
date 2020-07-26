import graphReducer from './reducers/graphReducer'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import fileLoadingReducer from './reducers/fileLoadingReducer'
import thunk from 'redux-thunk'

const reducers = combineReducers({
    graph: graphReducer,
    fileLoader: fileLoadingReducer
})

const store = createStore(reducers, applyMiddleware(thunk))

export default store
