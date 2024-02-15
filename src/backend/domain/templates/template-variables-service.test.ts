import { expect, test, vitest, describe, beforeEach, afterEach, it } from 'vitest';
import TemplateVariablesService from './template-variables-service';
import OutreachTemplateVariableRepository from 'src/backend/database/outreach-template-variable-repository';
import { RequestContext } from 'src/utils/request-context/request-context';
import awaitToError from 'src/utils/await-to-error';

describe('src/backend/domain/templates/template-variables-service.test.ts', () => {
    describe('TemplateVariablesService', () => {
        const OutreachTemplateVariableRepositoryGetAllMock = vitest.fn();
        const OutreachTemplateVariableRepositoryGetOneMock = vitest.fn();
        const OutreachTemplateVariableRepositoryUpdateMock = vitest.fn();
        const OutreachTemplateVariableRepositoryDeleteMock = vitest.fn();
        const OutreachTemplateVariableRepositoryCreateMock = vitest.fn();
        const getContextMock = vitest.fn();
        beforeEach(() => {
            RequestContext.getContext = getContextMock.mockReturnValue({ companyId: 'testCompanyId' });
            OutreachTemplateVariableRepository.getRepository = vitest.fn().mockReturnValue({
                getAll: OutreachTemplateVariableRepositoryGetAllMock,
                getOne: OutreachTemplateVariableRepositoryGetOneMock,
                update: OutreachTemplateVariableRepositoryUpdateMock,
                delete: OutreachTemplateVariableRepositoryDeleteMock,
                create: OutreachTemplateVariableRepositoryCreateMock,
            });
        });
        describe('get()', () => {
            beforeEach(() => {
                OutreachTemplateVariableRepositoryGetAllMock.mockResolvedValue([]);
            });
            afterEach(() => {
                vitest.clearAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateVariablesService.getService().get());
                expect(err.message).toBe('No company id found in request context');
            });
            test('should get all template variables', async () => {
                OutreachTemplateVariableRepositoryGetAllMock.mockResolvedValue([]);
                const result = await TemplateVariablesService.getService().get();
                expect(result).toEqual([]);
                expect(OutreachTemplateVariableRepositoryGetAllMock).toHaveBeenCalledWith('testCompanyId');
            });
        });
        describe('update()', () => {
            beforeEach(() => {
                OutreachTemplateVariableRepositoryUpdateMock.mockResolvedValue({});
            });
            afterEach(() => {
                vitest.clearAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    TemplateVariablesService.getService().update('some-id', {
                        category: 'some-category',
                        name: 'some-name',
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
            test('should update all template variables', async () => {
                await TemplateVariablesService.getService().update('some-id', {
                    category: 'some-category',
                    name: 'some-name',
                });

                expect(OutreachTemplateVariableRepositoryUpdateMock).toHaveBeenCalledWith('some-id', {
                    category: 'some-category',
                    name: 'some-name',
                });
            });
        });
        describe('delete()', () => {
            beforeEach(() => {
                OutreachTemplateVariableRepositoryDeleteMock.mockResolvedValue({});
            });
            afterEach(() => {
                vitest.clearAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateVariablesService.getService().delete('some-id'));
                expect(err.message).toBe('No company id found in request context');
            });
            test('should delete all template variables', async () => {
                await TemplateVariablesService.getService().delete('some-id');

                expect(OutreachTemplateVariableRepositoryDeleteMock).toHaveBeenCalledWith('some-id');
            });
        });
        describe('create()', () => {
            beforeEach(() => {
                OutreachTemplateVariableRepositoryCreateMock.mockResolvedValue({});
            });
            afterEach(() => {
                vitest.clearAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    TemplateVariablesService.getService().create({
                        category: 'some-category',
                        name: 'some-name',
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
            test('should create all template variables', async () => {
                await TemplateVariablesService.getService().create({
                    category: 'some-category',
                    name: 'some-name',
                });

                expect(OutreachTemplateVariableRepositoryCreateMock).toHaveBeenCalledWith('testCompanyId', {
                    category: 'some-category',
                    name: 'some-name',
                });
            });
        });
    });
});
