export default function CommentCard() {
    return (
        <div className="bg-gray-50/50 text-xs px-3 py-3 w-full duration-300 flex flex-col">
            <div className="flex align-center space-x-2">
                <div className="rounded-full w-6 h-6 p-1 row-center bg-primary-100 text-primary-500">
                    <div className="p-2">AY</div>
                </div>
                <div className="font-medium ">User name</div>
                <div className="text-gray-400">Date 01</div>
            </div>

            <div className="mb-2 pl-8">Need to confirm about the rate</div>
        </div>
    );
}
