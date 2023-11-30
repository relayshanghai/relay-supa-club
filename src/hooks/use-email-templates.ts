import useSWR from 'swr';
import { nextFetch } from 'src/utils/fetcher';
import type { TemplatesPostResponseBody } from 'pages/api/email-engine/templates';

export const useEmailTemplates = (templateIds: string[]) => {
    const { data: emailTemplates, mutate: refreshEmailTemplates } = useSWR(
        templateIds.length > 0 ? [templateIds, 'email_templates'] : null,
        ([templateIds]) =>
            nextFetch<TemplatesPostResponseBody>('email-engine/templates', {
                method: 'POST',
                body: { templateIds },
            }),
        { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
    );

    return {
        emailTemplates,
        refreshEmailTemplates,
    };
};
