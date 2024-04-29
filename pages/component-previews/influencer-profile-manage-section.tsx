import { useAtomValue } from 'jotai';
import { ManageSection } from 'src/components/influencer-profile/manage-section';
import { mockProfile, testSequenceId } from 'src/mocks/test-user';
import type { InfluencerOutreachData } from 'src/utils/outreach/types';
import { Provider as JotaiProvider } from 'jotai';
import { manageSectionUpdatingAtom } from 'src/components/influencer-profile/atoms';

const influencer: InfluencerOutreachData = {
    id: '9b778d64-496e-41a9-a6dd-c741ae40227b',
    created_at: '2023-09-06T05:16:32.072089+00:00',
    updated_at: '2023-09-06T06:06:11.909+00:00',
    added_by: mockProfile?.id,
    email: 'ekleinvt@gmail.com',
    sequence_step: 9,
    funnel_status: 'Posted',
    tags: ['culture', 'cultures', 'diversity'],
    next_step: null,
    scheduled_post_date: null,
    video_details: null,
    rate_amount: null,
    rate_currency: null,
    real_full_name: null,
    company_id: mockProfile?.company_id || '',
    sequence_id: testSequenceId,
    address_id: null,
    influencer_social_profile_id: 'f5935267-81ea-4cd1-9ba0-24e99c216bc0',
    iqdata_id: '6765597816304993286',
    manager_first_name: mockProfile?.first_name,
    name: 'Ella Klein',
    username: 'ekleinvt',
    avatar_url: 'https://p16-amd-va.tiktokcdn.com/tos-maliva-avt-0068/67456fa9aa8342692591b7b21d30f774~c5_720x720.jpeg',
    url: 'https://www.tiktok.com/@6765597816304993286',
    platform: 'tiktok',
    social_profile_last_fetched: '2023-08-31T07:28:14.856773+00:00',
    recent_post_title: 'recent post',
    recent_post_url: 'https://example.com',
    affiliate_link: 'https://example.com',
    commission_rate: 10.1,
};
const address = {
    id: '965072d5-2b89-4854-b50d-f20d22d1df42',
    name: 'name',
    created_at: 'created_at',
    updated_at: 'updated_at',
    country: 'country',
    state: 'state',
    city: 'city',
    postal_code: 'postal_code',
    address_line_1: 'address_line_1',
    address_line_2: 'address_line_2',
    tracking_code: 'tracking_code',
    phone_number: 'phone_number',
    influencer_social_profile_id: 'influencer_social_profile_id',
};
const Preview = () => {
    const updating = useAtomValue(manageSectionUpdatingAtom);
    return (
        <div className="m-5 max-w-xs bg-white">
            <div className="flex justify-between bg-primary-500 p-5">
                header section
                <div className="text-white">{updating ? 'updating...' : 'up to date'}</div>
            </div>
            <ManageSection influencer={influencer} address={address} onUpdateInfluencer={() => undefined} />
        </div>
    );
};

export const InfluencerProfileManageSectionPreview = () => {
    return (
        <JotaiProvider>
            <Preview />
        </JotaiProvider>
    );
};

export default InfluencerProfileManageSectionPreview;
