// for some context about feature flags, see `docs/feature-flags.md`

export const featPerformance = () => process.env.NEXT_PUBLIC_FEAT_PERFORMANCE === 'true';
export const featRecommended = () => process.env.NEXT_PUBLIC_FEAT_RECOMMENDED === 'true';
