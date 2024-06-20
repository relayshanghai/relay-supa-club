import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { type GetServerSideProps } from 'next';
import stream from 'stream';
import { promisify } from 'util';
import { apiClient as client } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

type PageProps = { downloadResult: boolean };

const DownloadPage = ({ downloadResult }: PageProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex h-full w-full items-center justify-center">
                <div className="relative w-[620px] flex-col items-center justify-start gap-16 rounded-xl border-2 border-violet-600 bg-white shadow">
                    <Image
                        className="absolute left-4 top-4"
                        src="/assets/imgs/logos/boostbot.svg"
                        width={25}
                        height={25}
                        alt="BoostBot Logo"
                    />
                    <div className="my-24 flex flex-col items-center justify-start gap-8 self-stretch px-8">
                        <div className="flex flex-col items-center justify-start gap-12 self-stretch">
                            <div className="flex flex-col items-center justify-start gap-6 self-stretch">
                                <div className="self-stretch text-center font-['Poppins'] text-xl font-normal text-slate-600">
                                    {downloadResult
                                        ? t('inbox.attachments.success')
                                        : t('inbox.attachments.failedToDownload')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = (async ({ req, res }) => {
    const pipeline = promisify(stream.pipeline);

    const url = (req.url as string).replace('/inbox/download/', '');
    const filename = url.split('/').pop();
    const [err, response] = await awaitToError(
        client.get(`/files/download-presign-url?path=${url}`, {
            responseType: 'stream',
        }),
    );
    if (err) {
        return { props: { downloadResult: false } };
    }
    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    await pipeline(response.data, res);

    return { props: { downloadResult: true } };
}) satisfies GetServerSideProps<PageProps>;

// serveside

export default DownloadPage;
