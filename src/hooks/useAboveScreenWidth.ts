import useMediaQuery from './useMediaQuery';

const useAboveScreenWidth = (width: number) => {
    return useMediaQuery(`(min-width: ${width}px)`);
};

export default useAboveScreenWidth;
