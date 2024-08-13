import { useState } from 'react';

export const usePaginationParam = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    return {
        page,
        setPage,
        size,
        setSize,
    };
};
