import Skeleton from '../common/skeleton';

export default function ContactsSkeleton() {
    return (
        <div className="" data-testid="contacts-skeleton">
            <div className="flex space-x-1">
                <Skeleton className="h-4 w-4 rounded-full bg-gray-300" />
                <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
                <Skeleton className="h-4 w-4 rounded-full" />
            </div>
        </div>
    );
}
