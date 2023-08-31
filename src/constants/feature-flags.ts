// for some context about feature flags, see `docs/feature-flags.md`

export const featRecommended = () => process.env.NEXT_PUBLIC_FEAT_RECOMMENDED === 'true';
export const featEmail = () => process.env.NEXT_PUBLIC_FEAT_EMAIL === 'true';
export const featNewPricing = () => process.env.NEXT_PUBLIC_FEAT_NEW_PRICING === 'true';
export const featBoostbot = () => process.env.NEXT_PUBLIC_FEAT_BOOSTBOT === 'true';