// for some context about feature flags, see `docs/feature-flags.md`

export const FEAT_PERFORMANCE = process.env.NEXT_PUBLIC_FEAT_PERFORMANCE === 'true';
export const FEAT_RECOMMENDED = process.env.NEXT_PUBLIC_FEAT_RECOMMENDED === 'true';
