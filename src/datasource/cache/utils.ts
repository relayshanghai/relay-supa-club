export function createKey(...tokens: (any[] | string | number)[]) {
    const _tokens = [];

    for (const v of tokens) {
        let token = v;

        if (Array.isArray(v)) {
            token = createKey(...v);
        }

        _tokens.push(token);
    }

    return tokens.join('.');
}

export function tokenizeKey(key: string) {
    return key.split('.');
}
