/* eslint-disable @typescript-eslint/no-explicit-any */
import { isToday, isYesterday, format } from "date-fns";
import { ru } from "date-fns/locale";

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

export const formatNumber = (number: string) => {
    const length = 7;
    if (number.length <= length) {
        return number;
    }
    const truncatedString = number.slice(0, length - 3);
    return `${truncatedString}...${number.slice(-1)}`;
};

export const formatFullName = (fullName: string) => {
    const words = fullName.split(' ');
    const initials = words.map(word => `${word[0]}.`).slice(1);
    return [words[0], ...initials].join(' ');
};

export const getHumanDate = (date: Date): string => {
    if (isToday(date)) {
        return 'Сегодня';
    } else if (isYesterday(date)) {
        return 'Вчера';
    } else if (date.getFullYear() === new Date().getFullYear()) {
        return format(date, "dd MMMM", { locale: ru });
    } else {
        return format(date, "dd MMMM yyyy", { locale: ru });
    }
};

export const getEnumKeyByValue = (enumConst: any, value: string) => {
    return Object.keys(enumConst)[Object.values(enumConst).indexOf(value)];
};

export const getEnumValueByKey = (enumConst: any, value: string) => {
    const typeArr = Object.entries(enumConst).find(([key]) => key === value);
    let type: any;
    if (typeArr) {
        type = typeArr[1];
    } else {
        type = "";
    }
    return type;
};