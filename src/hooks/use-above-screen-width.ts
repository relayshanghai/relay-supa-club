import useMediaQuery from './use-media-query';

const useAboveScreenWidth = (width: number) => {
    return useMediaQuery(`(min-width: ${width}px)`);
};

export default useAboveScreenWidth;
