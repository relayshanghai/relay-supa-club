// for some context about feature flags, see `docs/feature-flags.md`

export const featRecommended = () => process.env.NEXT_PUBLIC_FEAT_RECOMMENDED === 'true';
export const featSignupV2 = () => process.env.NEXT_PUBLIC_FEAT_SIGNUP_V2 === 'true';
