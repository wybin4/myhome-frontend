export const monthNamesInNominativeCase = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const bytesToSize = (bytes: number, decimals = 0) => {
    const kbToBytes = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
        'Б',
        'КБ',
        'МБ',
        'ГБ',
        'ТБ',
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(kbToBytes),
    );

    return `${parseFloat(
        (bytes / Math.pow(kbToBytes, index)).toFixed(dm),
    )} ${sizes[index]}`;
};

export const downloadPdf = (pdfBuffer: string, date: string) => {
    const base64Data = pdfBuffer;
    const buffer = Buffer.from(base64Data, 'base64');

    const blob = new Blob([buffer]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${new Date(date).getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
};