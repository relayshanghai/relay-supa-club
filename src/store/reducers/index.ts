import { combineReducers } from 'redux';
import product from './product';
import templateVariable from './template-variable';
import emailTemplate from './email-template';
import sequence from './sequence';
import sequenceTemplate from './sequence-template';
import sequenceInfluencer from './sequence-influencer';
import inboxFilter from './inbox-filter';
import report from './report';
import classicSearchParams from './classic-search-params';
import teammates from './teammates';

const rootReducer = combineReducers({
    product,
    templateVariable,
    emailTemplate,
    sequence,
    sequenceTemplate,
    sequenceInfluencer,
    inboxFilter,
    report,
    classicSearchParams,
    teammates,
});

export default rootReducer;
