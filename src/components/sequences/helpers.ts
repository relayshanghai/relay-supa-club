import type { TemplateVariableInsert } from 'src/utils/api/db';

/** 
 will leave out the missing variables and wrap them with `**variableName**`  
 */
export const fillInTemplateVariables = (email: string, templateVariables: TemplateVariableInsert[]) => {
    const splitEmail = email.split(/({{)|(}})/g);
    const filledInEmail = splitEmail.map((part) => {
        if (part?.includes('params.')) {
            const variableName = part.trim().replace('params.', '');
            const variable = templateVariables.find((v) => v.key === variableName);
            if (variable?.value) {
                return `<span class='text-purple-500'>${variable.value}</span>`;
            }
            return `<span class='text-purple-500'>**${part.split('params.')[1].trim()}**</span>`;
        }
        return part;
    });
    return filledInEmail
        .filter((part) => {
            return !part?.includes('{{') && !part?.includes('}}');
        })
        .join('');
};

export const replaceNewlinesAndTabs = (text: string) => {
    return text.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};
