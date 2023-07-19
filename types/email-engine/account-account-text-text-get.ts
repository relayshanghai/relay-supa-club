export type TextType = 'plain' | 'html' | '*';
export interface AccountAccountTextTextGetResponse {
    plain: string;
    html: string;
    /**Is the current text output capped or not */
    hasMore: boolean;
}
