import type { Post } from 'types';
import { CreatorPost } from './creator-post';

export const Posts = ({ posts, title }: { posts: Post[]; title: string }) => {
    const postsList = posts.length > 4 ? posts.slice(0, 4) : posts;

    if (postsList.length === 0) return null;
    return (
        <div className="p-6">
            <h2 className="text-gray-600 font-semibold mb-2">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {postsList.map((post, index) => (
                    <CreatorPost key={index} post={post} />
                ))}
            </div>
        </div>
    );
};
