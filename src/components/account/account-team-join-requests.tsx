import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shadcn/components/ui/button';
import { truncatedText } from 'src/utils/outreach/helpers';
import { Tooltip } from '../library';
import { useJoinRequests } from 'src/hooks/use-join-requests';

export const TeamJoinRequest = () => {
    const { getJoinRequests, joinRequests, acceptRequest, ignoreRequest } = useJoinRequests();

    useEffect(() => {
        getJoinRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { t } = useTranslation();
    return (
        <section id="team-details" className="w-full">
            <p className="pb-6 font-semibold">{t('account.company.joinRequest')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end" id="team-details-section">
                <div className="p-4 text-sm lg:w-3/4">
                    <div className="divide-grey-200 divide-y py-3">
                        {Array.isArray(joinRequests) &&
                            joinRequests.map((req) => {
                                return (
                                    <div key={req.id} className="flex w-full flex-row items-center space-x-8 py-2">
                                        <p className="basis-1/5 whitespace-nowrap text-sm font-medium">
                                            <Tooltip
                                                content={req.profile?.firstName + ' ' + req.profile?.lastName}
                                                position="top-left"
                                            >
                                                {truncatedText(
                                                    req.profile?.firstName + ' ' + req.profile?.lastName,
                                                    30,
                                                )}
                                            </Tooltip>
                                        </p>
                                        <p className="flex w-full basis-2/5 justify-start whitespace-nowrap text-start text-sm font-normal">
                                            <Tooltip
                                                content={req.profile?.email || ''}
                                                position="top-left"
                                                className="text-start"
                                            >
                                                {truncatedText(req.profile?.email || '', 50)}
                                            </Tooltip>
                                        </p>
                                        <div className="flex flex-row gap-x-1">
                                            <Button
                                                className="h-6 px-2 text-sm font-semibold"
                                                onClick={() => {
                                                    acceptRequest(req.id);
                                                }}
                                            >
                                                {t('account.company.acceptRequest')}
                                            </Button>
                                            <Button
                                                className="h-6 px-2 text-sm font-semibold"
                                                onClick={() => {
                                                    ignoreRequest(req.id);
                                                }}
                                                variant={'destructive'}
                                            >
                                                {t('account.company.ignoreRequest')}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </section>
        </section>
    );
};
