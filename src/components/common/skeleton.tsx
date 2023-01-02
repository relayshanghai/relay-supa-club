/** A number of pulsing grey rectangles (size and shape as props)
 *
 * @param blocks number of blocks to render
 * @param blockWidth width of each block, width in tailwind class w-..
 * @param blockHeight height of each block, height in tailwind class h-..
 * @param className additional classes to add to the skeleton blocks
 * @param containerClassName additional classes to add to the skeleton container
 */
export default function Skeleton({
    blocks = 1,
    blockWidth = 'full',
    blockHeight = 24,
    className,
    containerClassName
}: {
    blocks?: number;
    blockHeight?: number | string;
    blockWidth?: number | string;
    className?: string;
    containerClassName?: string;
}) {
    return (
        <div className={`flex flex-wrap space-x-2 mb-2 ${containerClassName}`}>
            {Array.from({ length: blocks }, (_, i) => (
                <div
                    key={i}
                    className={`bg-gray-200 animate-pulse rounded-md w-${blockWidth} h-${blockHeight} ${className}`}
                />
            ))}
        </div>
    );
}
