import { Rocket, Gift, Atoms, User, Megaphone } from 'app/components/icons';
import { type VariableWithValue } from 'src/store/reducers/sequence';
import * as cheerio from 'cheerio';

const DropdownIcon = (icon: JSX.Element) => {
    return <div className="mr-2 h-6 w-6">{icon}</div>;
};

export const variableCategories = [
    { name: 'Brand', icon: DropdownIcon(<Megaphone />) },
    { name: 'Product', icon: DropdownIcon(<Rocket />) },
    { name: 'Collab', icon: DropdownIcon(<Gift />) },
    { name: 'Influencers', icon: DropdownIcon(<User />) },
    { name: 'Wildcards', icon: DropdownIcon(<Atoms />) },
];

export const convertTiptapVariableToComponent = (content: string) => {
    /**
     * Convert the variable-component to {variable} for the tiptap editor
     * this wase based on the tiptap editor implementation
     *
     * @see src/components/tiptap/variable-node.tsx
     *
     * @param content
     */

    const spanRender = (text: string) => {
        return `
            <span class="inline font-semibold text-black">
                {<span class="content inline text-primary-600">${text}</span>}
            </span>
        `;
    };

    const cleanedHtml = content.replace(/<variable-component text="([^"]+)"><\/variable-component>/g, (_, text) =>
        spanRender(text),
    );

    return cleanedHtml;
};

export const substituteVariable = (content: string, variables: VariableWithValue[]) => {
    // Load the HTML string with cheerio
    const $ = cheerio.load(content);

    // Define the replacements
    const replacements = variables.reduce((acc: Record<string, string>, variable) => {
        acc[variable.name] = variable.value ? variable.value + '' : '';
        return acc;
    }, {});

    // Find all spans with the class "content" and replace their text content
    $('.content').each((_, element) => {
        const key = $(element).text().trim();
        if (replacements[key]) {
            $(element).text(replacements[key]);
        }
    });

    return $.html();
};
