export const SkeletonSearchResultRow = ({ delay }: { delay: number }) => (
    <tr className="animate-pulse bg-gray-200" style={{ animationDelay: `${delay}ms` }}>
        <td className="flex min-w-min flex-row items-center space-x-2 py-2 px-4">
            <div
                className="h-12 w-12 animate-pulse bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
            />
            <div>
                <div
                    className="h-3 w-32 animate-pulse bg-gray-400"
                    style={{ animationDelay: `${delay}ms` }}
                />
                <div
                    className="mt-2 h-2 w-24 animate-pulse bg-gray-400"
                    style={{ animationDelay: `${delay}ms` }}
                />
            </div>
        </td>
        <td className="pr-4 text-sm">
            <div
                className="ml-auto h-2 w-10 animate-pulse bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="pr-4 text-sm">
            <div
                className="ml-auto h-2 w-10 animate-pulse bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="pr-4 text-sm">
            <div
                className="ml-auto h-2 w-10 animate-pulse bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="pr-4 text-sm">
            <div
                className="ml-auto h-2 w-10 animate-pulse bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="text-sm">
            <div
                className="mx-auto h-10 w-7/12 animate-pulse bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
    </tr>
);
