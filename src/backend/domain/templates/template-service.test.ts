import OutreachTemplateRepository from 'src/backend/database/outreach-template-repository';
import EmailEngineService from 'src/backend/integration/email-engine/email-engine';
import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TemplateService from './template-service';
import { OutreachStepRequest } from 'pages/api/outreach/email-templates/request';
import awaitToError from 'src/utils/await-to-error';
import OutreachTemplateVariableRepository from 'src/backend/database/outreach-template-variable-repository';

describe('src/backend/domain/templates/template-service.ts', () => {
    describe('TemplateService', () => {
        const emailEngineCreateTemplateMock = vi.fn();
        const outreachTemplateRepositoryCreateMock = vi.fn();
        const emailEngineUpdateTemplateMock = vi.fn();
        const outreachTemplateRepositoryUpdateMock = vi.fn();
        const outreachTemplateRepositoryGetMock = vi.fn();
        const outreachTemplateRepositoryGetAllMock = vi.fn();
        const outreachTemplateRepositoryDeleteMock = vi.fn();
        const outreactTemplateVariableRepositoryGetMock = vi.fn();
        const getContextMock = vi.fn();
        beforeEach(() => {
            vi.resetAllMocks();
            RequestContext.getContext = getContextMock;
            getContextMock.mockReturnValue({
                companyId: 'some-of-company',
            });
        });
        describe('.create()', () => {
            beforeEach(() => {
                EmailEngineService.prototype.createTemplate = emailEngineCreateTemplateMock;
                emailEngineCreateTemplateMock.mockResolvedValue('some-email-template-id');
                OutreachTemplateRepository.prototype.create = outreachTemplateRepositoryCreateMock;
                outreachTemplateRepositoryCreateMock.mockResolvedValue({});
                OutreachTemplateVariableRepository.prototype.getAll = outreactTemplateVariableRepositoryGetMock;
                outreachTemplateRepositoryCreateMock.mockResolvedValue([]);
            });
            afterEach(() => {
                vi.resetAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    TemplateService.getService().create({
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    TemplateService.getService().create({
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should return success and trigger create function when request parameter is valid`, async () => {
                const [err] = await awaitToError(
                    TemplateService.getService().create({
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err).toBe(null);
                expect(emailEngineCreateTemplateMock).toBeCalledWith({
                    html: '<p>some html</p>',
                    name: 'OUTREACH',
                    subject: 'some subject',
                });
                expect(outreachTemplateRepositoryCreateMock).toBeCalledWith({
                    company_id: 'some-of-company',
                    email_engine_template_id: 'some-email-template-id',
                    step: 'OUTREACH',
                    subject: 'some subject',
                    template: '<p>some html</p>',
                    variableIds: [],
                    name: 'some name',
                });
            });
        });
        describe('.update()', () => {
            beforeEach(() => {
                EmailEngineService.prototype.updateTemplate = emailEngineUpdateTemplateMock;
                emailEngineUpdateTemplateMock.mockResolvedValue('some-email-template-id');
                OutreachTemplateRepository.prototype.update = outreachTemplateRepositoryUpdateMock;
                outreachTemplateRepositoryUpdateMock.mockResolvedValue({});
                OutreachTemplateRepository.prototype.get = outreachTemplateRepositoryGetMock;
                outreachTemplateRepositoryGetMock.mockResolvedValue({
                    step: 'OUTREACH',
                    email_engine_template_id: 'some-email-template-id',
                    subject: 'some-subject',
                    template: '<p>some html</p>',
                    description: 'some description',
                    name: 'some name',
                    variables: [],
                });
            });
            afterEach(() => {
                vi.resetAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    TemplateService.getService().update('some-id', {
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should throw not found error when template id does not exist`, async () => {
                outreachTemplateRepositoryGetMock.mockRejectedValue(new Error('not found'));
                const [err] = await awaitToError(
                    TemplateService.getService().update('some-id', {
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err.message).toBe('not found');
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    TemplateService.getService().update('some-id', {
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should return success and trigger update function when request parameter is valid`, async () => {
                const [err] = await awaitToError(
                    TemplateService.getService().update('some-id', {
                        step: OutreachStepRequest.OUTREACH,
                        subject: 'some subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                        variableIds: [],
                    }),
                );
                expect(err).toBe(null);
                expect(emailEngineUpdateTemplateMock).toBeCalledWith('some-email-template-id', {
                    html: '<p>some html</p>',
                    name: 'OUTREACH',
                    subject: 'some subject',
                });
                expect(outreachTemplateRepositoryUpdateMock).toBeCalledWith('some-id', {
                    company_id: 'some-of-company',
                    email_engine_template_id: 'some-email-template-id',
                    step: 'OUTREACH',
                    subject: 'some subject',
                    template: '<p>some html</p>',
                    description: 'some description',
                    name: 'some name',
                    variableIds: [],
                });
            });
        });
        describe('.delete()', () => {
            beforeEach(() => {
                OutreachTemplateRepository.prototype.delete = outreachTemplateRepositoryDeleteMock;
                outreachTemplateRepositoryUpdateMock.mockResolvedValue({});
                OutreachTemplateRepository.prototype.get = outreachTemplateRepositoryGetMock;
                outreachTemplateRepositoryGetMock.mockResolvedValue({
                    step: 'OUTREACH',
                    email_engine_template_id: 'some-email-template-id',
                    subject: 'some-subject',
                    template: '<p>some html</p>',
                    description: 'some description',
                    name: 'some name',
                    variables: [],
                });
            });
            afterEach(() => {
                vi.resetAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateService.getService().delete('some-id'));
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should throw not found error when template id does not exist`, async () => {
                outreachTemplateRepositoryGetMock.mockRejectedValue(new Error('not found'));
                const [err] = await awaitToError(TemplateService.getService().delete('some-id'));
                expect(err.message).toBe('not found');
            });
            it(`should return success and trigger delete function when request parameter is valid`, async () => {
                const [err] = await awaitToError(TemplateService.getService().delete('some-id'));
                expect(err).toBe(null);
                expect(outreachTemplateRepositoryDeleteMock).toBeCalledWith('some-of-company', 'some-id');
            });
        });
        describe('.getOne()', () => {
            beforeEach(() => {
                OutreachTemplateRepository.prototype.get = outreachTemplateRepositoryGetMock;
                outreachTemplateRepositoryGetMock.mockResolvedValue({
                    id: 'some-id',
                    step: 'OUTREACH',
                    email_engine_template_id: 'some-email-template-id',
                    subject: 'some-subject',
                    template: '<p>some html</p>',
                    variables: [],
                    description: 'some description',
                    name: 'some name',
                });
            });
            afterEach(() => {
                vi.resetAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should throw not found error when template id does not exist`, async () => {
                outreachTemplateRepositoryGetMock.mockRejectedValue(new Error('not found'));
                const [err] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err.message).toBe('not found');
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should return success and trigger getOne function when request parameter is valid`, async () => {
                const [err, data] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err).toBe(null);
                expect(data).toEqual({
                    id: 'some-id',
                    step: 'OUTREACH',
                    subject: 'some-subject',
                    template: '<p>some html</p>',
                    description: 'some description',
                    name: 'some name',
                    variables: [],
                });
            });
        });
        describe('.get()', () => {
            beforeEach(() => {
                OutreachTemplateRepository.prototype.getAll = outreachTemplateRepositoryGetAllMock;
                outreachTemplateRepositoryGetAllMock.mockResolvedValue([
                    {
                        id: 'some-id',
                        step: 'OUTREACH',
                        email_engine_template_id: 'some-email-template-id',
                        subject: 'some-subject',
                        template: '<p>some html</p>',
                        description: 'some description',
                        name: 'some name',
                    },
                ]);
            });
            afterEach(() => {
                vi.resetAllMocks();
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should throw not found error when template id does not exist`, async () => {
                outreachTemplateRepositoryGetMock.mockRejectedValue(new Error('not found'));
                const [err] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err.message).toBe('not found');
            });
            it(`should throw unauthorized error when company id does not setted up`, async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(TemplateService.getService().getOne('some-id'));
                expect(err.message).toBe('No company id found in request context');
            });
            it(`should return success and trigger getAll function when request parameter is valid`, async () => {
                const [err, data] = await awaitToError(
                    TemplateService.getService().getAll({
                        step: OutreachStepRequest.OUTREACH,
                    }),
                );
                expect(err).toBe(null);
                expect(data).toEqual([
                    {
                        id: 'some-id',
                        step: 'OUTREACH',
                        description: 'some description',
                        name: 'some name',
                    },
                ]);
            });
        });
    });
});
