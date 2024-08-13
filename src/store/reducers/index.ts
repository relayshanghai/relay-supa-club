import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';
import emailTemplate from './email-template';
import sequence from './sequence';
import sequenceTemplate from './sequence-template';

const rootReducer = combineReducers({
    product,
    templateVariable,
    emailTemplate,
    sequence,
    sequenceTemplate,
});

export default rootReducer;
