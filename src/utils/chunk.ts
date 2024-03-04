export const arrayChunk = <T>(array: Array<T>, chunkSize: number): Array<Array<T>> =>
    Array.from({ length: Math.ceil(array.length / chunkSize) }, (_v, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize),
    );
