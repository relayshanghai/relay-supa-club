import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as dbCalls from '../../../backend/database/outreach-template-variables';
import TemplateVariablesService from './template-variables';
import type {
    OutreachTemplateVariablesInsert,
    OutreachTemplateVariablesUpdate,
} from '../../../backend/database/outreach-template-variables';
import { RequestContext } from 'src/utils/request-context/request-context';
const companyId = 'company_1';

describe('src/backend/domain/templates/template-variables.test.ts', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        const getContextMock = vi.fn();
        RequestContext.getContext = getContextMock;
        getContextMock.mockReturnValue({
            companyId,
        });
    });
    describe('.getTemplateVariablesByCompanyId()', () => {
        it('calls correct db helper with correct parameters to get template variables by company id', () => {
            const getOutreachTemplateVariablesByCompanyIdCallMock = vi.fn();
            vi.spyOn(dbCalls, 'getOutreachTemplateVariablesByCompanyIdCall').mockImplementation(
                () => getOutreachTemplateVariablesByCompanyIdCallMock,
            );
            const templateVariablesService = new TemplateVariablesService();
            templateVariablesService.getTemplateVariablesByCompanyId();
            expect(getOutreachTemplateVariablesByCompanyIdCallMock).toHaveBeenCalledWith(companyId);
        });
    });
    describe('.updateTemplateVariable()', () => {
        it('calls correct db helper with correct parameters to update template variable', () => {
            const updateOutreachTemplateVariableCallMock = vi.fn();
            vi.spyOn(dbCalls, 'updateOutreachTemplateVariableCall').mockImplementation(
                () => updateOutreachTemplateVariableCallMock,
            );
            const update: OutreachTemplateVariablesUpdate = {
                company_id: 'companyId',
                id: 'variableId',
                name: 'variableName',
            };
            const templateVariablesService = new TemplateVariablesService();
            templateVariablesService.updateTemplateVariable(update);
            expect(updateOutreachTemplateVariableCallMock).toHaveBeenCalledWith(update);
        });
    });

    describe('.insertTemplateVariable()', () => {
        it('calls correct db helper with correct parameters to insert template variable', () => {
            const insertOutreachTemplateVariableCallMock = vi.fn();
            vi.spyOn(dbCalls, 'insertOutreachTemplateVariableCall').mockImplementation(
                () => insertOutreachTemplateVariableCallMock,
            );
            const insert: OutreachTemplateVariablesInsert = {
                company_id: 'companyId',
                name: 'variableName',
                category: 'brand',
            };
            const templateVariablesService = new TemplateVariablesService();
            templateVariablesService.insertTemplateVariable(insert);
            expect(insertOutreachTemplateVariableCallMock).toHaveBeenCalledWith(insert);
        });
    });
});
