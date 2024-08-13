import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';
import emailTemplate from './email-template';
import sequence from './sequence';
import sequenceTemplate from './sequence-template';
import sequenceInfluencer from './sequence-influencer';

const rootReducer = combineReducers({
    product,
    templateVariable,
    emailTemplate,
    sequence,
    sequenceTemplate,
    sequenceInfluencer,
});

export default rootReducer;
