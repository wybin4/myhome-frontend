const monthMappings: Record<string, string> = {
    "January": "Январь",
    "February": "Февраль",
    "March": "Март",
    "April": "Апрель",
    "May": "Май",
    "June": "Июнь",
    "July": "Июль",
    "August": "Август",
    "September": "Сентябрь",
    "October": "Октябрь",
    "November": "Ноябрь",
    "December": "Декабрь",
};

const weekdayMappings: Record<string, string> = {
    "Mo": "Пн",
    "Tu": "Вт",
    "We": "Ср",
    "Th": "Чт",
    "Fr": "Пт",
    "Sa": "Сб",
    "Su": "Вс",
};

export const translateMonthToRussian = (monthLabel: string) => {
    const [month, year] = monthLabel.split(" ");
    const russianMonth = monthMappings[month];
    if (russianMonth) {
        return `${russianMonth} ${year}`;
    }

    return monthLabel;
};

export const translateWeekdayToRussian = (weekdayLabel: string) => {
    const russianWeekday = weekdayMappings[weekdayLabel];
    return russianWeekday || weekdayLabel;
};