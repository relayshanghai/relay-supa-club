import Skeleton from './skeleton';

/** A pulsing grey skeleton block with a narrow title strip, and a number of grey rectangles below it (size and shape as props)
 *
 * @param blocks number of blocks to render
 * @param blockWidth width of each block
 * @param blockHeight height of each block
 * @param className additional classes to add to the skeleton blocks
 * @param containerClassName additional classes to add to the skeleton container
 * @param titleClassName additional classes to add to the skeleton container
 *
 */
export default function SkeletonWithTitle({
    containerClassName,
    titleClassName,
    ...props
}: {
    blocks?: number;
    blockHeight?: number | string;
    blockWidth?: number | string;
    className?: string;
    containerClassName?: string;
    titleClassName?: string;
}) {
    return (
        <div className={`flex w-full flex-col ${containerClassName}`}>
            <div className={`h-5 w-24 bg-gray-200 animate-pulse mb-2 ${titleClassName}`} />
            <Skeleton {...props} />
        </div>
    );
}
