/* eslint-disable complexity */
import { Layout } from '../layout';
import SequenceTable from './sequence-table';

import { SequenceStats } from './sequence-stats';

import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';
import { Brackets, Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import type { TabsProps } from '../library';
import { Badge, Switch, Tabs } from '../library';
import { Button } from '../button';
import { useState } from 'react';
import { TemplateVariablesModal } from './template-variables-modal';
import { useTranslation } from 'react-i18next';
import type { SequenceInfluencer } from 'src/utils/api/db';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Tooltip } from '../library';

export const SequencePage = ({ sequenceId }: { sequenceId: string }) => {
    const { t } = useTranslation();

    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequenceId);
    const { sequenceInfluencers } = useSequenceInfluencers(sequence && [sequenceId]);
    const { sequenceEmails: allSequenceEmails } = useSequenceEmails(sequence?.id);
    const { templateVariables } = useTemplateVariables(sequence?.id);
    const missingVariables = templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => variable.name) ?? ['Error retrieving variables'];
    const isMissingVariables = !templateVariables || templateVariables.length === 0 || missingVariables.length > 0;

    const handleStartSequence = async (sequenceInfluencers: SequenceInfluencer[]) => {
        return await sendSequence(sequenceInfluencers);
    };

    const handleAutostartToggle = async (checked: boolean) => {
        if (!sequence) {
            return;
        }
        await updateSequence({ id: sequenceId, auto_start: checked });
    };

    const [showUpdateTemplateVariables, setShowUpdateTemplateVariables] = useState(false);
    const handleOpenUpdateTemplateVariables = () => {
        setShowUpdateTemplateVariables(true);
    };

    const needsAttentionInfluencers = sequenceInfluencers?.filter(
        (influencer) => influencer.funnel_status === 'To Contact',
    );
    const inSequenceInfluencers = sequenceInfluencers?.filter(
        (influencer) => influencer.funnel_status === 'In Sequence',
    );
    const ignoredInfluencers = sequenceInfluencers?.filter((influencer) => influencer.funnel_status === 'Ignored');

    const tabs: TabsProps<SequenceInfluencer['funnel_status']>['tabs'] = [
        {
            label: 'sequences.needsAttention',
            value: 'To Contact',
            afterElement:
                needsAttentionInfluencers?.length && needsAttentionInfluencers.length > 0 ? (
                    <Badge roundSize={5}>{needsAttentionInfluencers.length}</Badge>
                ) : null,
        },
        {
            label: 'sequences.inSequence',
            value: 'In Sequence',
            afterElement:
                inSequenceInfluencers?.length && inSequenceInfluencers.length > 0 ? (
                    <Badge roundSize={5}>{inSequenceInfluencers.length}</Badge>
                ) : null,
        },
        {
            label: 'sequences.ignored',
            value: 'Ignored',
            afterElement:
                ignoredInfluencers?.length && ignoredInfluencers.length > 0 ? (
                    <Badge roundSize={5}>{ignoredInfluencers.length}</Badge>
                ) : null,
        },
    ];
    const [currentTab, setCurrentTab] = useState(tabs[0].value);

    const currentTabInfluencers = sequenceInfluencers?.filter((influencer) => influencer.funnel_status === currentTab);

    return (
        <Layout>
            <TemplateVariablesModal
                sequenceId={sequence?.id}
                visible={showUpdateTemplateVariables}
                onClose={() => setShowUpdateTemplateVariables(false)}
            />
            <div className="flex flex-col space-y-4 p-4">
                <div className="flex w-full">
                    <h1 className="mr-4 self-center text-2xl font-semibold text-gray-800">{sequence?.name}</h1>
                    <div onClick={() => (isMissingVariables ? setShowUpdateTemplateVariables(true) : null)}>
                        <Tooltip
                            content={
                                t('sequences.autoStartTooltip', {
                                    variables: missingVariables,
                                }) || ''
                            }
                            detail={
                                isMissingVariables
                                    ? t('sequences.autoStartTooltipDescription', {
                                          variables: missingVariables,
                                      })
                                    : ''
                            }
                            position="bottom-right"
                        >
                            <Switch
                                className={`${isMissingVariables ? 'pointer-events-none' : ''}`}
                                checked={sequence?.auto_start ?? false}
                                afterLabel={t('sequences.autoStart') || ''}
                                onChange={(e) => {
                                    handleAutostartToggle(e.target.checked);
                                }}
                            />
                        </Tooltip>
                    </div>
                    <Button onClick={handleOpenUpdateTemplateVariables} variant="secondary" className="ml-auto flex">
                        <Brackets className="mr-2 h-6" />
                        <p className="self-center">{t('sequences.updateTemplateVariables')}</p>
                    </Button>
                </div>
                <SequenceStats
                    totalInfluencers={sequenceInfluencers?.length || 0}
                    openRate={
                        (allSequenceEmails?.filter(
                            (email) =>
                                email.email_tracking_status === 'Link Clicked' ||
                                email.email_tracking_status === 'Opened',
                        ).length || 0) / (allSequenceEmails?.length || 1)
                    }
                    replyRate={
                        (allSequenceEmails?.filter((email) => email.email_delivery_status === 'Replied').length || 0) /
                        (allSequenceEmails?.length || 1)
                    }
                    bounceRate={
                        (allSequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length || 0) /
                        (allSequenceEmails?.length || 1)
                    }
                />
                <Tabs tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />

                {currentTabInfluencers && sequenceSteps ? (
                    <SequenceTable
                        sequenceInfluencers={currentTabInfluencers}
                        allSequenceEmails={allSequenceEmails}
                        sequenceSteps={sequenceSteps}
                        currentTab={currentTab}
                        missingVariables={missingVariables}
                        isMissingVariables={isMissingVariables}
                        setShowUpdateTemplateVariables={setShowUpdateTemplateVariables}
                        templateVariables={templateVariables ?? []}
                        handleStartSequence={handleStartSequence}
                    />
                ) : (
                    <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
                )}
            </div>
        </Layout>
    );
};
