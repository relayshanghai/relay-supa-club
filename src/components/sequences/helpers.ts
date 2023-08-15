import type { TemplateVariable } from 'src/utils/api/db';

/** 
 will leave out the missing variables and wrap them with `**variableName**`  
 */
export const fillInTemplateVariables = (email: string, templateVariables: TemplateVariable[]) => {
    const splitEmail = email.split(/({{)|(}})/g);
    const filledInEmail = splitEmail.map((part) => {
        if (part?.includes('params.')) {
            const variableName = part.trim().replace('params.', '');
            const variable = templateVariables.find((v) => v.key === variableName);
            if (variable?.value) {
                return variable.value;
            }
            return `**${part.split('params.')[1].trim()}**`;
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
