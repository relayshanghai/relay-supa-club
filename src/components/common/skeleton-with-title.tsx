import Skeleton from './skeleton';

/** A pulsing grey skeleton block with a narrow title strip, and a number of grey rectangles below it (size and shape as props)
 *
 * @param blocks number of blocks to render
 * @param className additional classes to add to the skeleton blocks
 * @param containerClassName additional classes to add to the skeleton container
 * @param titleClassName additional classes to add to the skeleton container
 *
 * @note If you want to change one of the already applied css styles in the passed in className, you need to use !important. e.g. className="h-32 w-32 !rounded-full"
 *
 */
export default function SkeletonWithTitle({
    containerClassName,
    titleClassName,
    ...props
}: {
    blocks?: number;
    className?: string;
    containerClassName?: string;
    titleClassName?: string;
}) {
    return (
        <div className={`flex w-full flex-col ${containerClassName}`}>
            <div className={`mb-2 h-5 w-24 animate-pulse bg-gray-200 ${titleClassName}`} />
            <Skeleton {...props} />
        </div>
    );
}
