import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';
import emailTemplate from './email-template';
import sequenceInfluencer from './sequence-influencer';

const rootReducer = combineReducers({
    product,
    templateVariable,
    emailTemplate,
    sequenceInfluencer
});

export default rootReducer;
