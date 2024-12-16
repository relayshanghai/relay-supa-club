import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shadcn/components/ui/button';
import { truncatedText } from 'src/utils/outreach/helpers';
import { Tooltip } from '../library';
import { useJoinRequests } from 'src/hooks/use-join-requests';
import { ConfirmModal } from 'app/components/confirmation/confirm-modal';
import toast from 'react-hot-toast';

export const TeamJoinRequest = () => {
    const { t } = useTranslation();
    const { getJoinRequests, joinRequests, acceptRequest, ignoreRequest } = useJoinRequests();
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [confirmType, setConfirmType] = useState<'accept' | 'ignore' | null>(null);
    const [request, setRequest] = useState({
        id: '',
        email: '',
    });

    useEffect(() => {
        getJoinRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toastText = (type: 'accept' | 'ignore' | null, result: 'success' | 'failed') => {
        if (type === 'accept' && result === 'success') {
            return t('account.company.successAccept') as string;
        } else if (type === 'accept' && result === 'failed') {
            return t('account.company.errorAccept') as string;
        } else if (type === 'ignore' && result === 'success') {
            return t('account.company.successIgnore') as string;
        } else if (type === 'ignore' && result === 'failed') {
            return t('account.company.errorIgnore') as string;
        }
        return '';
    };

    const actionHandler = () => {
        let p: Promise<any> | null = null;
        if (confirmType === 'accept') {
            p = acceptRequest(request.id as string);
        } else if (confirmType === 'ignore') {
            p = ignoreRequest(request.id as string);
        }
        if (p) {
            p.then(() => {
                toast.success(toastText(confirmType, 'success'));
            }).catch(() => {
                toast.error(toastText(confirmType, 'failed'));
            });
        }
    };

    const modalDescription = () => {
        if (confirmType === 'accept') {
            return t('account.company.acceptConfirmation', { email: request.email }) as string;
        } else if (confirmType === 'ignore') {
            return t('account.company.ignoreConfirmation', { email: request.email }) as string;
        }
    };

    return (
        <>
            <ConfirmModal
                positiveHandler={() => actionHandler()}
                setShow={(show) => setOpenConfirmationModal(show)}
                show={openConfirmationModal}
                title={modalDescription()}
                okButtonText={t('login.yesContinue') as string}
                cancelButtonText={t('account.cancel') as string}
            />
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
                                                        setOpenConfirmationModal(true);
                                                        setConfirmType('accept');
                                                        setRequest({
                                                            id: req.id,
                                                            email: req.profile?.email || '',
                                                        });
                                                    }}
                                                >
                                                    {t('account.company.acceptRequest')}
                                                </Button>
                                                <Button
                                                    className="h-6 px-2 text-sm font-semibold"
                                                    onClick={() => {
                                                        setOpenConfirmationModal(true);
                                                        setConfirmType('ignore');
                                                        setRequest({
                                                            id: req.id,
                                                            email: req.profile?.email || '',
                                                        });
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
        </>
    );
};
