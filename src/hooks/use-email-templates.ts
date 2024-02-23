import useSWR from 'swr';
import { nextFetch } from 'src/utils/fetcher';
import type { TemplatesPostResponseBody } from 'pages/api/email-engine/templates';
import { type TemplatesTemplateGetResponse } from 'types/email-engine/templates-template-get';

const emailTemplateSortFunction = (a: TemplatesTemplateGetResponse, b: TemplatesTemplateGetResponse) => {
    if (a.name === 'Outreach') {
        return -1; // "Outreach" comes first
    } else if (b.name === 'Outreach') {
        return 1; // "Outreach" comes later
    } else {
        // Sort alphabetically by name for all other elements
        return a.name.localeCompare(b.name);
    }
};

export const useEmailTemplates = (templateIds: string[]) => {
    const { data: emailTemplates, mutate: refreshEmailTemplates } = useSWR(
        templateIds.length > 0 ? [templateIds, 'email_templates'] : null,
        async ([ids]) => {
            const res = await nextFetch<TemplatesPostResponseBody>('email-engine/templates', {
                method: 'POST',
                body: { templateIds: ids },
            });

            return res.sort(emailTemplateSortFunction);
        },
        { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
    );

    return {
        emailTemplates,
        refreshEmailTemplates,
    };
};
