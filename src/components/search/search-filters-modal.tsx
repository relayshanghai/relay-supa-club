import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { formatter } from 'src/utils/formatter';
import { Modal } from '../modal';

/** Search Filter - Subscribers and Avg view filter options: 1k, 5k, 10k, 15k, 25k, 50k, 100k, 250k, 500k, 1m */
const options = [1e3, 5e3, 1e4, 15e3, 25e3, 50e3, 1e5, 25e4, 50e4, 1e6];

export const SearchFiltersModal = ({
    show,
    setShow,
}: {
    show: boolean;
    setShow: (open: boolean) => void;
}) => {
    const {
        audience,
        setAudience,
        views,
        setViews,
        gender,
        setGender,
        engagement,
        setEngagement,
        lastPost,
        setLastPost,
        contactInfo,
        setContactInfo,
    } = useSearch();

    const { t } = useTranslation();
    return (
        <Modal
            visible={show}
            onClose={() => setShow(false)}
            title={t('creators.filter.title') || ''}
        >
            <div className="p-8 space-y-5">
                <h3>{t('creators.filter.intro')}</h3>

                <div>
                    <label className="text-sm">
                        <h4 className="font-bold text-lg">{t('creators.filter.subscribers')}</h4>
                        <div className="flex flex-row space-x-4">
                            <div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={audience[0] ?? undefined}
                                    onChange={(e) => {
                                        setAudience((val) => [
                                            e.target.value === 'any' ? null : e.target.value,
                                            val[1],
                                        ]);
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.from')}</option>
                                    {options.map((val) => (
                                        <option
                                            value={val}
                                            key={val}
                                            disabled={!!audience[1] && val >= Number(audience[1])}
                                        >
                                            {formatter(val)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={audience[1] ?? undefined}
                                    onChange={(e) => {
                                        setAudience((val) => [
                                            val[0],
                                            e.target.value === 'any' ? null : e.target.value,
                                        ]);
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.to')}</option>
                                    {options.map((val) => (
                                        <option
                                            value={val}
                                            key={val}
                                            disabled={!!audience[0] && val <= Number(audience[0])}
                                        >
                                            {formatter(val)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </label>
                </div>
                <div>
                    <label className="text-sm">
                        <div className="font-bold text-lg">{t('creators.filter.averageViews')}</div>
                        <div className="flex flex-row space-x-4">
                            <div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={views[0] ?? undefined}
                                    onChange={(e) => {
                                        setViews((val) => [
                                            e.target.value === 'any' ? null : e.target.value,
                                            val[1],
                                        ]);
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.from')}</option>
                                    {options.map((val) => (
                                        <option
                                            value={val}
                                            key={val}
                                            disabled={!!views[1] && val >= Number(views[1])}
                                        >
                                            {formatter(val)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={views[1] ?? undefined}
                                    onChange={(e) => {
                                        setViews((val) => [
                                            val[0],
                                            e.target.value === 'any' ? null : e.target.value,
                                        ]);
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.to')}</option>
                                    {options.map((val) => (
                                        <option
                                            value={val}
                                            key={val}
                                            disabled={!!views[0] && val <= Number(views[0])}
                                        >
                                            {formatter(val)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </label>
                </div>
                <div>
                    <label className="text-sm">
                        <div className="font-bold text-lg">{t('creators.filter.gender')}</div>
                        <select
                            className="bg-primary-200 rounded-md p-1 mt-1"
                            value={gender}
                            onChange={(e) => {
                                if (e.target.value === 'any') {
                                    setGender(undefined);
                                } else {
                                    setGender(e.target.value);
                                }
                            }}
                        >
                            <option value={'any'}>{t('creators.filter.any')}</option>
                            <option value={'male'}>{t('creators.filter.male')}</option>
                            <option value={'female'}>{t('creators.filter.female')}</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label className="text-sm">
                        <div className="font-bold text-lg">
                            {' '}
                            {t('creators.filter.engagementRate')}
                        </div>
                        <select
                            className="bg-primary-200 rounded-md p-1 mt-1"
                            value={engagement}
                            onChange={(e) => {
                                if (e.target.value === 'any' || Number(e.target.value) === 0) {
                                    setEngagement(undefined);
                                } else {
                                    setEngagement(Number(e.target.value));
                                }
                            }}
                        >
                            <option value={'any'}>{t('creators.filter.any')}</option>
                            {Array.from(Array(10)).map((_, i) => {
                                return (
                                    <option key={i} value={i + 1}>
                                        {`>` + (i + 1) + `%`}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="text-sm">
                        <div className="font-bold text-lg">{t('creators.filter.lastPost')}</div>
                        <select
                            className="bg-primary-200 rounded-md p-1 mt-1"
                            value={lastPost}
                            onChange={(e) => {
                                if (e.target.value === 'any') {
                                    setLastPost(undefined);
                                } else {
                                    setLastPost(e.target.value);
                                }
                            }}
                        >
                            <option value={'any'}>{t('creators.filter.any')}</option>
                            <option value={30}>30 {t('creators.filter.days')}</option>
                            <option value={90}>3 {t('creators.filter.months')}</option>
                            <option value={120}>6 {t('creators.filter.months')}</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label className="text-sm">
                        <div className="font-bold text-lg">
                            {t('creators.filter.contactInformation')}
                        </div>
                        <select
                            className="bg-primary-200 rounded-md p-1 mt-1"
                            value={contactInfo}
                            onChange={(e) => {
                                if (e.target.value === 'any') {
                                    setContactInfo(undefined);
                                } else {
                                    setContactInfo(e.target.value);
                                }
                            }}
                        >
                            <option value={'any'}>{t('creators.filter.any')}</option>
                            <option value={'email'}>{t('creators.filter.emailAvailable')}</option>
                        </select>
                    </label>
                </div>
            </div>
        </Modal>
    );
};
