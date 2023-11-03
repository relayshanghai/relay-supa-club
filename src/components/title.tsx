import Link from 'next/link';
import { BoostbotSelected } from './icons';

export const Title = () => {
    return (
        <Link href="/boostbot" prefetch={false}>
            <BoostbotSelected className="h-6 w-6" />
        </Link>
    );
};
