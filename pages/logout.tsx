import { useEffect } from 'react';
import { useUser } from 'src/hooks/use-user';

export default function Logout() {
    const { logout } = useUser();

    useEffect(() => {
        logout();
    });

    return <>Logging out...</>;
}
