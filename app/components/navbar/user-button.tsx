import Link from 'next/link';
import { useEffect, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from 'shadcn/components/ui/dropdown-menu';
import { useUserV2 } from 'src/hooks/v2/use-user';

export const UserButton: FC = () => {
    const { t } = useTranslation();
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [profileFirstName, setProfileFirstName] = useState('');
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);
    const { user, profile } = useUserV2();

    useEffect(() => {
        if (user) setLoggedIn(true);
        if (profile) setProfileFirstName(profile.first_name);
    }, [user, profile]);

    if (!loggedIn) return <></>;
    return (
        <div className="flex flex-row items-center justify-center">
            <DropdownMenu open={accountMenuOpen} onOpenChange={(open) => setAccountMenuOpen(open)}>
                <DropdownMenuTrigger>
                    <div
                        data-testid="layout-account-menu"
                        ref={accountMenuButtonRef}
                        className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 p-2 text-base text-gray-800 shadow-sm"
                    >
                        {profileFirstName[0]}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                    <div
                        className="border-gray flex w-fit origin-top-right flex-col overflow-hidden bg-white"
                        ref={accountMenuRef}
                    >
                        <Link
                            href="/account"
                            passHref
                            className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                            {t('navbar.account')}
                        </Link>
                        <Button
                            className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                            variant="neutral"
                            onClick={() => {
                                window.stop(); // cancel any inflight requests
                                window.location.href = '/logout';
                            }}
                        >
                            {t('navbar.logout')}
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
