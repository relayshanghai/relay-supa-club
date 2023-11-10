import Link from 'next/link';
import { BoostbotSelected } from './icons';

export const Title = () => {
    return (
        <Link data-testid="home-icon" href="/boostbot" prefetch={false}>
            <BoostbotSelected className="h-6 w-6" />
        </Link>
    );
};
