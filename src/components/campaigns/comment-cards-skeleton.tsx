import Skeleton from '../common/skeleton';

export default function CommentCardsSkeleton() {
    const CommentCardSkeleton = (
        <div className="w-[300px] rounded-md bg-gray-50/50">
            <div className="flex items-center">
                <Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
                <Skeleton className="mx-3 h-2 w-8 bg-gray-500" />
                <Skeleton className="h-2 w-16 bg-gray-200" />
            </div>
            <div className="ml-10 mt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    );

    const CommentCardReverseSkeleton = (
        <div className="w-[300px] place-self-end rounded-md bg-gray-50/50 ">
            <div className="flex flex-row-reverse items-center">
                <Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
                <Skeleton className="mx-3 h-2 w-8  bg-gray-500" />
                <Skeleton className="h-2 w-16 bg-gray-200" />
            </div>
            <div className="ml-10 mt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    );

    return (
        <div className="flex w-full flex-col space-y-2 p-2">
            {CommentCardSkeleton} {CommentCardSkeleton} {CommentCardSkeleton}
            {CommentCardReverseSkeleton}
        </div>
    );
}
