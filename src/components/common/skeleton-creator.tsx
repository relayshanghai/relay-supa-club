/**
 * @description A column with a number of skeletons with a round avatar and a title.
 * @param {number} rowLimit The number of rows to render.
 *
 */
export default function SkeletonCreator({ rowLimit = 5 }) {
    return (
        <div>
            <div className="mb-2 h-5 w-24 animate-pulse bg-gray-200" />
            {Array.from({ length: rowLimit }, (_, k) => (
                <div key={k} className="flex justify-center space-y-2 align-middle">
                    <div
                        className="mr-2 animate-pulse bg-gray-200"
                        style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '50%',
                            minWidth: '4rem',
                        }}
                    />
                    <div className="h-16 w-full animate-pulse rounded-md bg-gray-200" />
                </div>
            ))}
        </div>
    );
}
