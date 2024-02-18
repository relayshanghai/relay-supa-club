export const doesObjectMatchUpdate = (object: any, update: any): boolean => {
    return Object.keys(update).every((key) => key in object && object[key] === update[key]);
};
