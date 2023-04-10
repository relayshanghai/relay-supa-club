import Skeleton from '../common/skeleton';

export default function ContactsSkeleton() {
    return (
        <div className="flex space-x-1" data-testid="contacts-skeleton">
            <Skeleton className="h-4 w-4 rounded-full bg-gray-300" />
            <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
            <Skeleton className="h-4 w-4 rounded-full" />
        </div>
    );
}
