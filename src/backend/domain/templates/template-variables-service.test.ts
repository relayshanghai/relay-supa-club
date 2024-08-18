import { expect, test, vitest, describe, beforeEach, afterEach, it } from 'vitest';
import TemplateVariablesService from './template-variables-service';
import { RequestContext } from 'src/utils/request-context/request-context';
import awaitToError from 'src/utils/await-to-error';
import OutreachEmailTemplateVariableRepository from 'src/backend/database/sequence-email-template/sequence-email-template-variable-repository';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';

describe('src/backend/domain/templates/template-variables-service.test.ts', () => {
    describe('TemplateVariablesService', () => {
        // Generate a new UUID
        const companyId = 'test-company-id';
        const whereCompany = {
            where: {
                company: {
                    id: companyId,
                },
            },
        };
        const getContextMock = vitest.fn();
        beforeEach(() => {
            RequestContext.getContext = getContextMock.mockReturnValue({ companyId });
        });
        describe('get()', () => {
            let OutreachTemplateVariableRepositoryGetAllMock = vitest.fn();
            beforeEach(() => {
                OutreachTemplateVariableRepositoryGetAllMock = OutreachEmailTemplateVariableRepository.prototype.find =
                    vitest.fn().mockReturnValue(
                        [1, 2, 3].map((d) => ({
                            id: `some-id-${d}`,
                            category: 'some-category',
                            name: `some-name-${d}`,
                            company: { id: companyId },
                        })) as OutreachEmailTemplateVariableEntity[],
                    );
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
                const result = await TemplateVariablesService.getService().get();
                expect(result).toEqual(
                    [1, 2, 3].map((d) => ({
                        id: `some-id-${d}`,
                        category: 'some-category',
                        name: `some-name-${d}`,
                        company: { id: companyId },
                    })),
                );
                expect(OutreachTemplateVariableRepositoryGetAllMock).toHaveBeenCalledWith(whereCompany);
            });
        });
        describe('create()', () => {
            let OutreachTemplateVariableRepositoryCreateMock = vitest.fn();
            beforeEach(() => {
                OutreachTemplateVariableRepositoryCreateMock = OutreachEmailTemplateVariableRepository.prototype.save =
                    vitest.fn().mockReturnValue({
                        id: `some-id`,
                        category: 'some-category',
                        name: `some-name`,
                        company: { id: companyId },
                    } as OutreachEmailTemplateVariableEntity);
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

                expect(OutreachTemplateVariableRepositoryCreateMock).toHaveBeenCalledWith({
                    category: 'some-category',
                    name: 'some-name',
                    company: { id: companyId },
                });
            });
        });
        describe('delete()', () => {
            let OutreachTemplateVariableRepositoryDeleteMock = vitest.fn();
            beforeEach(() => {
                OutreachTemplateVariableRepositoryDeleteMock =
                    OutreachEmailTemplateVariableRepository.prototype.delete = vitest.fn().mockReturnValue({});
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
        describe('update()', () => {
            let OutreachTemplateVariableRepositoryUpdateMock = vitest.fn();
            beforeEach(() => {
                OutreachTemplateVariableRepositoryUpdateMock =
                    OutreachEmailTemplateVariableRepository.prototype.update = vitest.fn().mockReturnValue({});
                OutreachEmailTemplateVariableRepository.prototype.findOneOrFail = vitest.fn().mockReturnValue({
                    id: `some-id`,
                    category: 'some-category',
                    name: `some-name`,
                    company: { id: companyId },
                });
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

                expect(OutreachTemplateVariableRepositoryUpdateMock).toHaveBeenCalledWith(
                    {
                        id: `some-id`,
                        category: 'some-category',
                        name: `some-name`,
                        company: { id: companyId },
                    },
                    {
                        category: 'some-category',
                        name: 'some-name',
                    },
                );
            });
        });
    });
});
