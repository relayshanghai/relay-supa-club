import { t } from 'i18next';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState } from 'react';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/icons';
import { CollabAddPostModalInput } from './collab-add-post-modal-input';
import type { PostUrl } from 'pages/api/influencer/[id]/posts-by-influencer';

type Props = {
    isLoading?: boolean | null;
    onSave?: (urls: PostUrl[], setUrls: (urls: PostUrl[]) => void) => void;
};

const isDuplicate = (url: string, urls: string[]) => {
    if (!url) return false;

    return urls.some((u) => u === url);
};

const createEmptyUrl = () => {
    return { value: '', id: nanoid(5), error: null };
};

export const CollabAddPostModalForm = ({ isLoading, ...props }: Props) => {
    const [urls, setUrls] = useState<PostUrl[]>(() => [createEmptyUrl()]);

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
            props.onSave && props.onSave(validUrls, (urls: PostUrl[]) => setUrls(urls));
        }
    }, [props, validUrls]);

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
                <Button
                    disabled={validUrls.length !== urls.length || !!isLoading}
                    variant="secondary"
                    onClick={handleNewUrlField}
                >
                    {t('campaigns.post.addAnotherPost')}
                </Button>

                <Button disabled={validUrls.length <= 0 || !!isLoading} onClick={handleSave}>
                    {isLoading ? (
                        <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                    ) : (
                        t('campaigns.post.submit')
                    )}
                </Button>
            </div>
        </>
    );
};
