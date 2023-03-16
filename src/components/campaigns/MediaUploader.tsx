import type { ChangeEventHandler} from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Plus from 'src/components/icons/Plus';
import Trashcan from 'src/components/icons/Trashcan';
import toast from 'react-hot-toast';

function MediaUploader({
    media,
    setMedia,
    previousMedia,
    setPreviousMedia,
    setPurgedMedia,
}: {
    media: File[];
    setMedia: (media: File[]) => void;
    previousMedia: object[];
    setPreviousMedia: (previousMedia: object[]) => void;
    setPurgedMedia: (purgedMedia: File[]) => void;
}) {
    const { t } = useTranslation();
    const inputFiles = useRef(null);

    const onButtonClick = () => {
        const { current } = inputFiles;
        (
            current || {
                click: () => {
                    // quiet linter
                },
            }
        ).click();
    };

    const validateAndSetSelectedFile = (files: FileList) => {
        for (let i = 0; i <= files.length - 1; i++) {
            const file = files.item(i);
            if (!file) continue;
            const fileSize = file.size / 1024 / 1024;
            if (fileSize > 5) {
                toast(t('campaigns.form.fileSizeErrorAlert'));
                return;
            } else setMedia([...media, file]);
        }
    };

    const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        if (!e.target.files) return;
        validateAndSetSelectedFile(e.target.files);
    };

    const removeFile = (index: number) => {
        setMedia([...media.filter((file: any) => media.indexOf(file) !== index)]);
    };

    const removePreviousMedia = (index: number) => {
        //@ts-ignore
        setPurgedMedia((pm: any) => [...pm, previousMedia[index]]);
        setPreviousMedia([
            ...previousMedia.filter((file: any) => previousMedia.indexOf(file) !== index),
        ]);
    };

    const mediaList = () =>
        media.map((file: any, index: number) => (
            <div className="mb-4 flex items-center justify-between" key={index}>
                <div className="flex">
                    <div className="mr-4 box-border h-6 w-6">
                        <img
                            className="h-full w-full rounded-md object-cover"
                            src={URL.createObjectURL(media[index])}
                            alt="media gallery icon"
                        />
                    </div>
                    <div className="text-sm">{file.name}</div>
                </div>
                <Trashcan
                    onClick={() => removeFile(index)}
                    data-idx={index}
                    className="h-4 w-4 cursor-pointer text-primary-400 hover:fill-primary-600"
                />
            </div>
        ));

    const previousMediaList = () =>
        previousMedia?.map((file: any, index: number) => (
            <div className="mb-4 flex items-center justify-between" key={index}>
                <div className="flex">
                    <div className="mr-4 box-border h-6 w-6">
                        <img
                            className="h-full w-full rounded-md object-cover"
                            src={file.url}
                            alt="media gallery icon"
                        />
                    </div>
                    <div className="text-sm">{file.name}</div>
                </div>
                <Trashcan
                    onClick={() => removePreviousMedia(index)}
                    data-idx={index}
                    className="h-4 w-4 cursor-pointer fill-tertiary-400 duration-300 hover:fill-primary-500"
                />
            </div>
        ));

    return (
        <div>
            {media?.length || previousMedia?.length ? (
                <div>
                    {previousMediaList()}
                    {mediaList()}
                </div>
            ) : (
                <div className="mb-4 text-center text-xs text-tertiary-600">
                    {t('campaigns.form.noMedia')}
                </div>
            )}
            <div className="btn btn-fileupload group" onClick={onButtonClick}>
                <Plus className="mr-2 h-6 w-6 fill-current text-gray-500 group-hover:text-primary-500" />
                <input
                    onChange={onFileChange}
                    type="file"
                    id="file"
                    accept="image/*"
                    ref={inputFiles}
                    multiple
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
}

export default MediaUploader;
