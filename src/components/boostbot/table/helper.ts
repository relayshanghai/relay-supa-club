export const getPaginationItems = (
    currentPage: number,
    lastPage: number,
    /** 
    * This refers to the number of page links you want to display in your pagination component. For example, if noOfLinks is set to 10, your pagination UI will consistently show 10 page links at a time. (It acts as a limiter if you the number of links is greater than no OFlinks the disabled links(...) will be used. 

    * noOfLinks 10 would give you "1,2,3 ... 7,8... 11, 12, 13". 
    
    * if noOfLinks 11, the first 5 and last 5 are active, with one link disabled in the middle. You can visualize it like this:

    * Active Links: [1] [2] [3] [4] [5] [...] [7] [8] [9] [10] [11]

    * [1] to [5] are the first 5 active links.
    * [...] represents the disabled link in the middle.
    * [7] to [11] are the last 5 active links. 
    */
    noOfLinks: number,
) => {
    const res = [];
    const firstPage = 1;
    const divisionOfLinks = 3; // represents first page  , .... , lastpage that will always be visible
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
