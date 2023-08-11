import { t } from 'i18next';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState } from 'react';
import { Button } from 'src/components/button';
import { CollabAddPostModalInput } from './collab-add-post-modal-input';
import { Spinner } from 'src/components/icons';
import { useInfluencers } from 'src/hooks/use-influencers';

export type PostUrl = {
    value: string;
    id: string;
    error: string | null;
};

type Props = {
    onSave?: (urls: PostUrl[]) => void;
};

const isDuplicate = (url: string, urls: string[]) => {
    if (!url) return false;

    return urls.some((u) => u === url);

    if (Object.values(urls).filter((u) => u === url).length > 1) {
        return true;
        // return t('campaigns.post.duplicateUrl');
    }
    //check for duplicates in the already added ones as well
    // if (addedUrls.filter((u) => u.url === url).length > 0) {
    //     return t('campaigns.post.duplicateUrl');
    // }
    return '';
};

const createEmptyUrl = () => {
    return { value: '', id: nanoid(5), error: null };
};

export const CollabAddPostModalForm = (props: Props) => {
    const [urls, setUrls] = useState<PostUrl[]>(() => [createEmptyUrl()]);
    const { savePosts } = useInfluencers();

    const handleUrlInputUpdate = useCallback(
        (url: PostUrl, index: number) => {
            const error = isDuplicate(
                url.value,
                urls.map((u) => u.value),
            )
                ? t('campaigns.post.duplicateUrl')
                : url.error;

            setUrls((s) => {
                s.splice(index, 1, { ...url, error });
                return [...s];
            });
        },
        [urls],
    );

    const handleNewUrlField = useCallback(() => {
        setUrls((s) => [...s, createEmptyUrl()]);
    }, []);

    const validUrls = useMemo(() => urls.filter((u) => u.error === null && u.value !== ''), [urls]);

    const handleSave = useCallback(() => {
        if (validUrls.length > 0 && props.onSave) {
            savePosts.call('your-influencer-id', validUrls).then(() => {
                props.onSave && props.onSave(validUrls);
            });
            // @todo do some error handling
            // .catch((e) => console.error(e))
        }
    }, [props, validUrls, savePosts]);

    const urlFields = useMemo(() => {
        if (urls.length <= 0) return null;

        return urls.map((url, index) => {
            return (
                <div key={`${url.id}`} className="my-2 flex flex-col gap-y-2">
                    <CollabAddPostModalInput url={url} onUpdate={(u) => handleUrlInputUpdate(u, index)} />
                </div>
            );
        });
    }, [handleUrlInputUpdate, urls]);

    return (
        <>
            {urlFields}

            <div className="ml-auto flex gap-x-3">
                <Button disabled={validUrls.length !== urls.length} variant="secondary" onClick={handleNewUrlField}>
                    {t('campaigns.post.addAnotherPost')}
                </Button>

                <Button disabled={validUrls.length <= 0 || !!savePosts.isLoading} onClick={handleSave}>
                    {savePosts.isLoading ? (
                        <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                    ) : (
                        t('campaigns.post.submit')
                    )}
                </Button>
            </div>
        </>
    );
};
