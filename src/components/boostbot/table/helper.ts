export const getPaginationItems = (currentPage: number, lastPage: number, noOfLinks: number) => {
    const res = [];
    const firstPage = 1;
    const divisionOfLinks = 3;
    const deductednoOfLinks = noOfLinks - divisionOfLinks;
    const noLeftPages = deductednoOfLinks / 2;

    const pushRange = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
            res.push(i);
        }
    };
    const conditions = {
        pagesLessThanLinks: lastPage <= noOfLinks,
        handleOneEllipsis: currentPage - firstPage < noLeftPages || lastPage - currentPage < noLeftPages,
        handleTwoEllipsis: currentPage - firstPage >= deductednoOfLinks && lastPage - currentPage >= deductednoOfLinks,
        isNearFirstPage: currentPage - firstPage < lastPage - currentPage,
    };
    if (conditions.pagesLessThanLinks) {
        pushRange(1, lastPage);
    } else if (conditions.handleOneEllipsis) {
        pushRange(1, noLeftPages + firstPage);
        res.push(NaN);
        pushRange(lastPage - noLeftPages, lastPage);
    } else if (conditions.handleTwoEllipsis) {
        const deductednoLeftPages = noLeftPages - 1;
        res.push(1, NaN);
        pushRange(currentPage - deductednoLeftPages, currentPage + deductednoLeftPages);
        res.push(NaN, lastPage);
    } else {
        let remainingLength = noOfLinks;

        if (conditions.isNearFirstPage) {
            for (let m = 1; m <= currentPage + 1; m++) {
                res.push(m);
                remainingLength -= 1;
            }
            res.push(NaN);
            remainingLength -= 1;
            pushRange(lastPage - (remainingLength - 1), lastPage);
        } else {
            for (let o = lastPage; o >= currentPage - 1; o--) {
                res.unshift(o);
                remainingLength -= 1;
            }
            res.unshift(NaN);
            remainingLength -= 1;
            for (let p = remainingLength; p >= 1; p--) {
                res.unshift(p);
            }
        }
    }

    return res;
};
