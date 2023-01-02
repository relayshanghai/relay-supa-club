/**
 * @description A column with a number of skeletons with a round avatar and a title.
 * @param {number} rowLimit The number of rows to render.
 *
 */
export default function SkeletonCreator({ rowLimit = 5 }) {
    return (
        <div>
            <div className="h-5 w-24 bg-gray-200 animate-pulse mb-2" />
            {Array.from({ length: rowLimit }, (_, k) => (
                <div key={k} className="flex space-y-2 align-middle justify-center">
                    <div
                        className="bg-gray-200 animate-pulse mr-2"
                        style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '50%',
                            minWidth: '4rem'
                        }}
                    />
                    <div className="w-full h-16 bg-gray-200 animate-pulse rounded-md" />
                </div>
            ))}
        </div>
    );
}
