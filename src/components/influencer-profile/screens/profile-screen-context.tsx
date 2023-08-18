import { createContainerContext } from 'src/utils/create-container-context';
import type { ProfileValue } from './profile-screen';
import { createStore } from 'src/utils/create-store';

export const {
    Context: ProfileScreenContext,
    Provider: ProfileScreenProvider,
    useContainerContext: useProfileScreenContext,
} = createContainerContext<ProfileValue>();

export const useUiState = createStore({
    isNotesListOverlayOpen: false,
    isProfileOverlayOpen: false,
});
