import { useTranslation } from 'react-i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { GUIDE_PAGE } from 'src/utils/rudderstack/event-names';
import { enUS } from 'src/constants';
import FAQSection from './faq/FAQSection';
import { OldGuideComponent } from './old-guide';

export const GuideComponent = ({ showVideo = false, useFaq = true }: { showVideo?: boolean; useFaq?: boolean }) => {
    const { trackEvent } = useRudderstack();
    const { i18n } = useTranslation();
    const usedLanguage = i18n.language === enUS ? 'en' : 'cn';

    return (
        <div onLoad={() => trackEvent(GUIDE_PAGE('opened'))} className="m-10 flex flex-col items-center gap-6">
            {useFaq ? <FAQSection locale={usedLanguage} /> : <OldGuideComponent showVideo={showVideo} />}
        </div>
    );
};
