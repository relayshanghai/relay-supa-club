/* eslint-disable complexity */
import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { clientLogger } from 'src/utils/logger-client';
import { SequenceStats } from './sequence-stats';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { useSequences } from 'src/hooks/use-sequences';
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

export const SequencePage = () => {
    const { t } = useTranslation();

    const { profile } = useUser();
    const { company } = useCompany();
    const { sequences } = useSequences(); // later we won't use this, the sequence id will be passed down from the index page.
    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequences?.[0]?.id);
    const { sequenceInfluencers, updateSequenceInfluencer } = useSequenceInfluencers(sequence?.id);
    const { sequenceEmails: allSequenceEmails, updateSequenceEmail } = useSequenceEmails(sequence?.id);
    const { templateVariables } = useTemplateVariables(sequence?.id);
    const missingVariables = templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => variable.name) ?? ['Error retrieving variables'];
    const isMissingVariables = !templateVariables || templateVariables.length === 0 || missingVariables.length > 0;

    const handleStartSequence = async () => {
        // update sequence - autostart - true.
        const allResults = [];
        if (!sequenceInfluencers || !sequenceSteps) {
            return;
        }
        for (const sequenceInfluencer of sequenceInfluencers) {
            const sequenceEmails = allSequenceEmails?.filter(
                (email) => email.sequence_influencer_id === sequenceInfluencer.id,
            );
            if (!sequenceEmails) {
                allResults.push('no email for sequenceInfluencer: ' + sequenceInfluencer.id);
                continue;
            }
            const params = {
                companyName: company?.name ?? '',
                outreachPersonName: profile?.first_name ?? '',
            };
            const results = await sendSequence({
                account: testAccount,
                sequenceInfluencer,
                sequenceEmails,
                params,
                sequenceSteps,
                updateSequenceEmail,
                updateSequenceInfluencer,
            });
            allResults.push(results);
        }
        clientLogger(allResults);
    };

    const handleAutostartToggle = async (checked: boolean) => {
        if (!sequence) {
            return;
        }
        await updateSequence({ id: sequence.id, auto_start: checked });
        if (checked) {
            // TODO: This is not the final logic
            await handleStartSequence();
        }
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
                needsAttentionInfluencers?.length && needsAttentionInfluencers?.length > 0 ? (
                    <Badge roundSize={5}>{needsAttentionInfluencers?.length}</Badge>
                ) : null,
        },
        {
            label: 'sequences.inSequence',
            value: 'In Sequence',
            afterElement:
                inSequenceInfluencers?.length && inSequenceInfluencers?.length > 0 ? (
                    <Badge roundSize={5}>{inSequenceInfluencers?.length}</Badge>
                ) : null,
        },
        {
            label: 'sequences.ignored',
            value: 'Ignored',
            afterElement:
                ignoredInfluencers?.length && ignoredInfluencers?.length > 0 ? (
                    <Badge roundSize={5}>{ignoredInfluencers?.length}</Badge>
                ) : null,
        },
    ];
    const [currentTab, setCurrentTab] = useState(tabs[0].value);

    const currentTabInfluencers = sequenceInfluencers?.filter((influencer) => influencer.funnel_status === currentTab);

    return (
        <Layout>
            <TemplateVariablesModal
                visible={showUpdateTemplateVariables}
                onClose={() => setShowUpdateTemplateVariables(false)}
            />
            <div className="flex flex-col space-y-4 p-4">
                <div className="flex w-full">
                    <h1 className="mr-4 self-center text-2xl font-semibold text-gray-800">{sequence?.name}</h1>
                    <div onClick={() => (isMissingVariables ? setShowUpdateTemplateVariables(true) : null)}>
                        <Tooltip
                            content={
                                isMissingVariables
                                    ? t('sequences.missingRequiredTemplateVariables_variables', {
                                          variables: missingVariables,
                                      })
                                    : ''
                            }
                            position="bottom-right"
                        >
                            <Switch
                                className={`${isMissingVariables ? 'pointer-events-none' : ''}`}
                                checked={sequence?.auto_start ?? false}
                                afterLabel="Auto-start"
                                onChange={(e) => {
                                    handleAutostartToggle(e.target.checked);
                                }}
                            />
                        </Tooltip>
                    </div>
                    <Button onClick={handleOpenUpdateTemplateVariables} variant="secondary" className="ml-auto flex">
                        <Brackets className="mr-2" />
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
                        ).length || 0) / (allSequenceEmails?.length || 0)
                    }
                    replyRate={
                        (allSequenceEmails?.filter((email) => email.email_delivery_status === 'Replied').length || 0) /
                        (allSequenceEmails?.length || 0)
                    }
                    bounceRate={
                        (allSequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length || 0) /
                        (allSequenceEmails?.length || 0)
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
                    />
                ) : (
                    <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
                )}
            </div>
        </Layout>
    );
};
