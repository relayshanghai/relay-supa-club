import { describe, test, expect, vi } from 'vitest';
import * as dbCalls from '../../../backend/database/outreach-template-variables';
import TemplateVariablesService from './template-variables';
import type {
    OutreachTemplateVariablesInsert,
    OutreachTemplateVariablesUpdate,
} from '../../../backend/database/outreach-template-variables';

describe('src/backend/domain/templates/template-variables.test.ts', () => {
    test('method: getTemplateVariablesByCompanyId calls correct db helper with correct parameters to get template variables by company id', () => {
        const getOutreachTemplateVariablesByCompanyIdCallMock = vi.fn();
        vi.spyOn(dbCalls, 'getOutreachTemplateVariablesByCompanyIdCall').mockImplementation(
            () => getOutreachTemplateVariablesByCompanyIdCallMock,
        );
        const companyId = 'companyId';
        const templateVariablesService = new TemplateVariablesService();
        templateVariablesService.getTemplateVariablesByCompanyId(companyId);
        expect(getOutreachTemplateVariablesByCompanyIdCallMock).toHaveBeenCalledWith(companyId);
    });

    test('method: updateTemplateVariable calls correct db helper with correct parameters to update template variable', () => {
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

    test('method: insertTemplateVariable calls correct db helper with correct parameters to insert template variable', () => {
        const insertOutreachTemplateVariableCallMock = vi.fn();
        vi.spyOn(dbCalls, 'insertOutreachTemplateVariableCall').mockImplementation(
            () => insertOutreachTemplateVariableCallMock,
        );
        const insert: OutreachTemplateVariablesInsert = {
            company_id: 'companyId',
            name: 'variableName',
            value: 'variableValue',
        };
        const templateVariablesService = new TemplateVariablesService();
        templateVariablesService.insertTemplateVariable(insert);
        expect(insertOutreachTemplateVariableCallMock).toHaveBeenCalledWith(insert);
    });
});
