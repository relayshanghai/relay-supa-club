// for some context about feature flags, see `docs/feature-flags.md`

export const featRecommended = () => process.env.NEXT_PUBLIC_FEAT_RECOMMENDED === 'true';
// enable email for users created after august 31st 2023
const cutoffDate = new Date('2023-08-31');
export const featEmail = (userCreatedDate: Date) => userCreatedDate > cutoffDate;

export const featNewSearchTable = (userCreatedDate: Date) => userCreatedDate > cutoffDate;
