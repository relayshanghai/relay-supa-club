/** A number of pulsing grey rectangles (size and shape as props)
 *
 * @param blocks number of blocks to render
 * @param className additional classes to add to the skeleton blocks
 * @param containerClassName additional classes to add to the skeleton container
 *
 * @note If you want to change one of the already applied css styles in the passed in className, you need to use !important. e.g. className="h-32 w-32 !rounded-full"
 */
export default function Skeleton({
    blocks = 1,
    className,
    containerClassName,
}: {
    blocks?: number;
    className?: string;
    containerClassName?: string;
}) {
    return (
        <div className={`mb-2 flex flex-wrap space-x-2 ${containerClassName}`}>
            {Array.from({ length: blocks }, (_, i) => (
                <div key={i} className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
            ))}
        </div>
    );
}
