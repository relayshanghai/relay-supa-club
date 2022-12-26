import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Plus from 'src/components/icons/Plus';
import Trashcan from 'src/components/icons/Trashcan';
import toast from 'react-hot-toast';

function MediaUploader({ media, setMedia, prevMedia, setPrevMedia, setPurgedMedia }) {
    const { t } = useTranslation();
    const inputFiles = useRef(null);

    const onButtonClick = () => {
        const { current } = inputFiles;
        (
            current || {
                click: () => {
                    // quiet linter
                }
            }
        ).click();
    };

    const validateSelectedFile = (files) => {
        for (let i = 0; i <= files.length - 1; i++) {
            const file = files.item(i).size / 1024 / 1024;
            if (file > 5) {
                toast(t('campaigns.form.fileSizeErrorAlert'));
                return;
            } else setMedia([...media, files.item(i)]);
        }
    };

    const onFileChange = (e) => {
        validateSelectedFile(e.target.files);
    };

    const removeFile = (idx) => {
        setMedia([...media.filter((file) => media.indexOf(file) !== Number.parseInt(idx, 10))]);
    };

    const removePrevMedia = (idx) => {
        setPurgedMedia((pm) => [...pm, prevMedia[idx]]);
        setPrevMedia([
            ...prevMedia.filter((file) => prevMedia.indexOf(file) !== Number.parseInt(idx, 10))
        ]);
    };

    const mediaList = () =>
        media.map((file, index) => (
            <div className="flex items-center justify-between mb-4" key={index}>
                <div className="flex">
                    <div className="h-6 w-6 box-border mr-4">
                        <img
                            className="w-full h-full object-cover rounded-md"
                            src={URL.createObjectURL(media[index])}
                            alt="media gallery icon"
                        />
                    </div>
                    <div className="text-sm">{file.name}</div>
                </div>
                <Trashcan
                    onClick={() => removeFile(index)}
                    data-idx={index}
                    className="cursor-pointer w-4 h-4 text-primary-400 hover:fill-primary-600"
                />
            </div>
        ));

    const prevMediaList = () =>
        prevMedia.map((file, index) => (
            <div className="flex items-center justify-between mb-4" key={index}>
                <div className="flex">
                    <div className="h-6 w-6 box-border mr-4">
                        <img
                            className="w-full h-full object-cover rounded-md"
                            src={file.url}
                            alt="media gallery icon"
                        />
                    </div>
                    <div className="text-sm">{file.filename}</div>
                </div>
                <Trashcan
                    onClick={() => removePrevMedia(index)}
                    data-idx={index}
                    className="cursor-pointer w-4 h-4 fill-tertiary-400 hover:fill-primary-500 duration-300"
                />
            </div>
        ));

    return (
        <div>
            {media?.length || prevMedia?.length ? (
                <div>
                    {mediaList()}
                    {prevMediaList()}
                </div>
            ) : (
                <div className="text-xs text-center text-tertiary-600 mb-4">
                    {t('campaigns.form.noMedia')}
                </div>
            )}
            <div className="btn btn-fileupload" onClick={onButtonClick}>
                <Plus className="mr-2 fill-current text-gray-600 w-4 h-4" />
                <div className="text-xs text-tertiary-600">{t('campaigns.form.uploadImage')}</div>
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
