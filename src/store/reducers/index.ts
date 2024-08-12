import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';
import emailTemplate from './email-template';
import sequence from './sequence';

const rootReducer = combineReducers({
    product,
    templateVariable,
    emailTemplate,
    sequence,
});

export default rootReducer;
