import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';
import emailTemplate from './email-template';

const rootReducer = combineReducers({
    product,
    templateVariable,
    emailTemplate,
});

export default rootReducer;
