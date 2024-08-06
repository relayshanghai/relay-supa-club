import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';

const rootReducer = combineReducers({
    product,
    templateVariable,
});

export default rootReducer;
