import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Modal, type ModalProps } from '../modal';
import { useTranslation } from 'react-i18next';
import { Info } from '../icons';
import { Tooltip } from '../library';
import type { TemplateVariable, TemplateVariableInsert } from 'src/utils/api/db';
import { useEffect, useState } from 'react';
import { Button } from '../button';
import toast from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger-client';

export interface TemplateVariablesModalProps extends Omit<ModalProps, 'children'> {
    sequenceId?: string;
}
const prepareTemplateVariables = (templateVariables: TemplateVariable[], sequenceId?: string) => {
    const blankVariable: (key: string) => TemplateVariableInsert = (key) => ({
        key,
        value: '',
        name: '',
        sequence_id: sequenceId ?? '',
    });
    const brandName = templateVariables.find((variable) => variable.key === 'brandName') ?? blankVariable('brandName');
    const marketingManagerName =
        templateVariables.find((variable) => variable.key === 'marketingManagerName') ??
        blankVariable('marketingManagerName');
    const productName =
        templateVariables.find((variable) => variable.key === 'productName') ?? blankVariable('productName');
    const productDescription =
        templateVariables.find((variable) => variable.key === 'productDescription') ??
        blankVariable('productDescription');
    const productFeatures =
        templateVariables.find((variable) => variable.key === 'productFeatures') ?? blankVariable('productFeatures');
    const productLink =
        templateVariables.find((variable) => variable.key === 'productLink') ?? blankVariable('productLink');
    const productPrice =
        templateVariables.find((variable) => variable.key === 'productPrice') ?? blankVariable('productPrice');
    const influencerNiche =
        templateVariables.find((variable) => variable.key === 'influencerNiche') ?? blankVariable('influencerNiche');
    return {
        brandName,
        marketingManagerName,
        productName,
        productDescription,
        productFeatures,
        productLink,
        productPrice,
        influencerNiche,
    };
};
type VariableKey = keyof ReturnType<typeof prepareTemplateVariables>;
const VariableInput = ({
    variableKey,
    variables,
    setKey,
    tooltipLeft,
    placeholder,
    readOnly,
}: {
    variableKey: VariableKey;
    variables: ReturnType<typeof prepareTemplateVariables>;
    setKey: (key: VariableKey, value: string) => void;
    tooltipLeft?: boolean;
    placeholder?: string | null;
    readOnly?: boolean;
}) => {
    const { t } = useTranslation();
    const value = variables[variableKey]?.value ?? '';
    return (
        <div className="mt-4 flex w-full flex-col gap-y-1">
            <label className="inline-flex" htmlFor={`template-variable-input-${variableKey}`}>
                <h5 className="text-xs font-semibold text-gray-700">{`{{`}</h5>
                <h5 className={`mx-1 text-xs font-semibold ${readOnly ? 'text-gray-500' : 'text-primary-600'}`}>
                    {t(`sequences.${variableKey}`)}
                </h5>
                <h5 className="text-xs font-semibold text-gray-700">{`}}`}</h5>
                {t(`sequences.${variableKey}Tooltip`) && (
                    <Tooltip
                        content={t(`sequences.${variableKey}Tooltip`)}
                        detail={t(`sequences.${variableKey}TooltipDescription`)}
                        tooltipClasses="max-w-xs"
                        position={tooltipLeft ? 'bottom-left' : 'bottom-right'}
                    >
                        <Info className="ml-2 h-4 w-4 text-gray-300" />
                    </Tooltip>
                )}
            </label>
            <input
                readOnly={readOnly}
                id={`template-variable-input-${variableKey}`}
                className={`block w-full max-w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 text-sm placeholder-gray-400 shadow ring-1 ring-gray-300 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 ${
                    readOnly && 'cursor-not-allowed focus:border-transparent focus:ring-0'
                }`}
                placeholder={readOnly ? t('sequences.wellHandleThisOne') ?? '' : placeholder || ''}
                value={value}
                onChange={(e) => (readOnly ? null : setKey(variableKey, e.target.value))}
            />
        </div>
    );
};

export const TemplateVariablesModal = ({ sequenceId, ...props }: TemplateVariablesModalProps) => {
    const { t } = useTranslation();
    const { templateVariables, updateTemplateVariable, insertTemplateVariable } = useTemplateVariables(sequenceId);
    useEffect(() => {
        setVariables(prepareTemplateVariables(templateVariables ?? [], sequenceId));
    }, [templateVariables, sequenceId]);
    const [variables, setVariables] = useState(prepareTemplateVariables(templateVariables ?? []));

    const setKey = (key: VariableKey, value: string) => {
        if (!variables[key]) return;
        setVariables({ ...variables, [key]: { ...variables[key], value: value } });
    };
    const [submitting, setSubmitting] = useState(false);

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            const updates = Object.values(variables).map((variable) => {
                const existingRecord = templateVariables?.find((v) => v.key === variable.key);
                if (existingRecord) {
                    return async () => await updateTemplateVariable({ ...existingRecord, value: variable.value });
                }

                return async () => await insertTemplateVariable(variable);
            });

            await Promise.all(updates);
            toast.success(t('sequences.templateVariablesUpdated'));
        } catch (error) {
            toast.error(t('sequences.templateVariablesUpdateError'));
            clientLogger(error, 'error');
        }
        setSubmitting(false);
    };

    return (
        <Modal maxWidth="max-w-xl" {...props} title={t('sequences.templateVariablesModalTitle') ?? ''}>
            <h5 className="text-xs text-gray-500">{t('sequences.templateVariablesModalSubtitle')}</h5>

            <h4 className="mt-4 font-semibold text-gray-700">{t('sequences.company')}</h4>
            <div className="flex justify-between gap-6">
                <VariableInput
                    variableKey="brandName"
                    setKey={setKey}
                    variables={variables}
                    placeholder={t('sequences.brandNamePlaceholder')}
                />
                <VariableInput
                    variableKey="marketingManagerName"
                    setKey={setKey}
                    variables={variables}
                    tooltipLeft
                    placeholder={t('sequences.marketingManagerNamePlaceholder')}
                />
            </div>
            <hr className="my-4" />

            <h4 className="font-semibold text-gray-700">{t('sequences.product')}</h4>

            <VariableInput
                variableKey="productName"
                setKey={setKey}
                variables={variables}
                placeholder={t('sequences.productNamePlaceholder')}
            />
            <VariableInput
                variableKey="productLink"
                setKey={setKey}
                variables={variables}
                placeholder={t('sequences.productLinkPlaceholder')}
            />
            <VariableInput
                variableKey="productDescription"
                setKey={setKey}
                variables={variables}
                placeholder={t('sequences.productDescriptionPlaceholder')}
            />
            <VariableInput
                variableKey="productFeatures"
                setKey={setKey}
                variables={variables}
                placeholder={t('sequences.productFeaturesPlaceholder')}
            />

            <hr className="my-4" />

            <h4 className="font-semibold text-gray-700">{t('sequences.influencer')}</h4>

            <VariableInput
                variableKey="influencerNiche"
                setKey={setKey}
                variables={variables}
                placeholder={t('sequences.influencerNichePlaceholder')}
            />
            <div className="flex justify-between gap-6">
                {/* These ones are filled in using the `influencer_social_profile` so we don't have a `template_variable` DB row for them */}
                <VariableInput
                    variableKey={'influencerNameOrHandle' as any}
                    setKey={setKey}
                    variables={variables}
                    readOnly
                />
                <VariableInput
                    variableKey={'recentVideoTitle' as any}
                    setKey={setKey}
                    variables={variables}
                    readOnly
                    tooltipLeft
                />
            </div>

            <div className="mt-10 flex w-full justify-end gap-4">
                <Button variant="secondary" onClick={() => props.onClose(false)}>
                    {t('sequences.cancel')}
                </Button>
                <Button onClick={handleUpdate} disabled={submitting}>
                    {t('sequences.updateVariables')}
                </Button>
            </div>
        </Modal>
    );
};
