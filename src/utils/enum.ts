export const enumToArray = (enumObject: any, exclude?: any[]) => {
    return Object.keys(enumObject)
        .map((key) => enumObject[key])
        .filter((value) => !exclude?.includes(value));
};
