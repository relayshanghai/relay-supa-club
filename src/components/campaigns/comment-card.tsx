// import { useUser } from 'src/hooks/use-user';

export default function CommentCard() {
    //add conditional styling for the user's own comment, flex-end
    // const { profile } = useUser();
    // const isYour = profile.id === note.user_id;

    return (
        <div className="bg-gray-50/50 text-xs px-3 py-3 max-w-3/4 duration-300 flex flex-col">
            {/* temp placeholder texts below to be replaced in V2-139 */}
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
