import type { AllSequenceInfluencersBasicInfo } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import type { SearchTableInfluencer } from 'types';

export const getPaginationItems = (
    currentPage: number,
    lastPage: number,
    /** 
    * This refers to the number of page links you want to display in your pagination component. For example, if numberOfLinks is set to 10, your pagination UI will consistently show 10 page links at a time. (It acts as a limiter if you the number of links is greater than no OFlinks the disabled links(...) will be used. 

    * numberOfLinks 10 would give you "1,2,3 ... 7,8... 11, 12, 13". 
    
    * if numberOfLinks is 11, the first 5 and last 5 are active, with one link disabled in the middle. You can visualize it like this:

    * Active Links: [1] [2] [3] [4] [5] [...] [7] [8] [9] [10] [11]

    * [1] to [5] are the first 5 active links.
    * [...] represents the disabled link in the middle.
    * [7] to [11] are the last 5 active links. 
    */
    numberOfLinks: number,
) => {
    const res = [];
    const firstPage = 1;
    const divisionOfLinks = 3; // represents first page  , .... , last page that will always be visible
    const linkDivisions = numberOfLinks - divisionOfLinks;
    const pagesLeft = linkDivisions / 2;

    const pushRange = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
            res.push(i);
        }
    };
    const conditions = {
        pagesLessThanLinks: lastPage <= numberOfLinks,
        handleOneEllipsis: currentPage - firstPage < pagesLeft || lastPage - currentPage < pagesLeft,
        handleTwoEllipsis: currentPage - firstPage >= linkDivisions && lastPage - currentPage >= linkDivisions,
        isNearFirstPage: currentPage - firstPage < lastPage - currentPage,
    };
    if (conditions.pagesLessThanLinks) {
        pushRange(1, lastPage);
    } else if (conditions.handleOneEllipsis) {
        pushRange(1, pagesLeft + firstPage);
        res.push(NaN);
        pushRange(lastPage - pagesLeft, lastPage);
    } else if (conditions.handleTwoEllipsis) {
        const pagesLeftTwoEllipsis = pagesLeft - 1;
        res.push(1, NaN);
        pushRange(currentPage - pagesLeftTwoEllipsis, currentPage + pagesLeftTwoEllipsis);
        res.push(NaN, lastPage);
    } else {
        let remainingLength = numberOfLinks;

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

export const filterOutAlreadyAddedInfluencers = (
    allSequenceInfluencers: AllSequenceInfluencersBasicInfo[],
    influencers: SearchTableInfluencer[],
) => {
    const allSequenceInfluencersSet = new Set(allSequenceInfluencers.map(({ iqdata_id }) => iqdata_id));

    return influencers.filter(({ user_id }) => !allSequenceInfluencersSet.has(user_id));
};
