export const SkeletonSearchResultRow = ({ delay }: { delay: number }) => (
    <tr className="bg-gray-200 animate-pulse" style={{ animationDelay: `${delay}ms` }}>
        <td className="py-2 px-4 flex flex-row items-center space-x-2 min-w-min">
            <div
                className="bg-gray-400 animate-pulse w-12 h-12"
                style={{ animationDelay: `${delay}ms` }}
            />
            <div>
                <div
                    className="bg-gray-400 animate-pulse w-32 h-6"
                    style={{ animationDelay: `${delay}ms` }}
                />
                <div
                    className="bg-gray-400 animate-pulse w-24 h-4 mt-2"
                    style={{ animationDelay: `${delay}ms` }}
                />
            </div>
        </td>
        <td className="text-sm">
            <div
                className="bg-gray-400 animate-pulse w-10 h-4"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="text-sm">
            <div
                className="bg-gray-400 animate-pulse w-10 h-4"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="text-sm">
            <div
                className="bg-gray-400 animate-pulse w-10 h-4"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
        <td className="text-sm">
            <div
                className="bg-gray-400 animate-pulse w-10 h-4"
                style={{ animationDelay: `${delay}ms` }}
            />
        </td>
    </tr>
);
