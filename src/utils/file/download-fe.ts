export const downloadCSV = (csvContent: string, csvName: string) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', csvName);
    document.body.appendChild(link);
    link.click();
};

export const downloadFile = (blob: Blob, fileName: string) => {
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};
