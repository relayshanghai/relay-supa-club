import { createContainerContext } from 'src/utils/create-container-context';
import type { ProfileValue } from './profile-screen';

export const {
    Context: ProfileScreenContext,
    Provider: ProfileScreenProvider,
    useContainerContext: useProfileScreenContext,
} = createContainerContext<ProfileValue>();
