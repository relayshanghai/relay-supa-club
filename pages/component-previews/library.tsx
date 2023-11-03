import LibraryPreviewPage from 'src/components/library/library-preview-page';

const Library = () => (typeof window === 'undefined' ? null : <LibraryPreviewPage />);

export default Library;
