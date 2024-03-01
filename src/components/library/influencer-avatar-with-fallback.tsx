import { AvatarDefault } from '../icons';
import { imgProxy } from 'src/utils/fetcher';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';

export const InfluencerAvatarWithFallback = ({
    url,
    name,
    size = 56,
    className,
    bordered = false,
}: {
    url?: string | null;
    name?: string | null;
    size?: number;
    className?: string;
    bordered?: boolean;
}) => {
    return (
        <Avatar
            className={`flex-none rounded-full ${bordered && 'border-8 border-white shadow-lg'}`}
            style={{ width: size, height: size }}
        >
            <AvatarImage
                data-testid={`influencer-avatar-${name}`}
                className={`inline-block bg-slate-300 ${className} aspect-square rounded-full`}
                alt={`Influencer avatar ${name ?? url}`}
                src={imgProxy(url ?? '') ?? ''}
                width={size}
                height={size}
            />

            <AvatarFallback>
                <AvatarDefault
                    data-testid={`influencer-avatar-${name}`}
                    height={size}
                    width={size}
                    className={`inline-block aspect-square rounded-full bg-slate-300 ${className}`}
                />
            </AvatarFallback>
        </Avatar>
    );
};
