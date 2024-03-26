import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeEach, describe, it, vi, expect } from 'vitest';
import TemplateVariableRepository from './template-variable-repository';
import { type SequenceEntity } from '../sequence/sequence-entity';

describe('src/backend/database/template-variable/template-variable-repository.ts', () => {
    const getContextMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();

        RequestContext.getContext = getContextMock;
        getContextMock.mockReturnValue({
            companyId: 'company_1',
            requestUrl: 'https://example.com',
            session: { user: { id: 'user_1' } },
        });
    });
    describe('TemplateVariableRepository', () => {
        describe('insertIntoTemplateVariables', () => {
            afterEach(() => {
                vi.clearAllMocks();
                vi.resetAllMocks();
            });

            it('should create new sequence step data', async () => {
                const saveMock = vi.spyOn(TemplateVariableRepository.getRepository(), 'save').mockResolvedValue({
                    sequence: { id: 'sequence_1' } as SequenceEntity,
                    name: 'test_variable',
                    key: 'test_variable',
                    value: 'Test 1',
                    id: '2f4abc24-21d4-44bb-8357-6d688629abf0',
                    required: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                await TemplateVariableRepository.getRepository().insertIntoTemplateVariables('sequence_1', [
                    { name: 'test_variable', value: 'Test 1' },
                ]);

                expect(saveMock).toHaveBeenCalledWith({
                    sequence: { id: 'sequence_1' },
                    name: 'test_variable',
                    key: 'test_variable',
                    value: 'Test 1',
                });
            });
        });
    });
});
