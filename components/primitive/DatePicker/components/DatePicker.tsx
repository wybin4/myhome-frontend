import styles from '../DatePicker.module.css';
import { NavButton } from "./NavButton";
import { FocusedInput, START_DATE, useDatepicker } from "@datepicker-react/hooks";
import { useEffect } from "react";
import { Month } from "./Month";
import DatepickerContext from "../helpers/datepickerContext";
import ArrowIcon from '../arrow.svg';
import { DatePickerProps, } from "../DatePicker.props";
import cn from "classnames";
import { Button } from '../../Button/Button';

export const DatePicker = ({
    innerRef,
    dateRange, setDateRange,
    className,
    setChoosedDates,
    ...props
}: DatePickerProps): JSX.Element => {

    const {
        firstDayOfWeek,
        activeMonths,
        isDateSelected,
        isDateHovered,
        isFirstOrLastSelectedDate,
        isDateBlocked,
        isDateFocused,
        focusedDate,
        onDateHover,
        onDateSelect,
        onDateFocus,
        goToPreviousMonths,
        goToNextMonths,
    } = useDatepicker({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        focusedInput: dateRange.focusedInput,
        onDatesChange: handleDateChange,
        numberOfMonths: 1,
    });

    function handleDateChange(data: {
        startDate: Date,
        endDate: Date,
        focusedInput: FocusedInput
    }) {
        if (!data.focusedInput) {
            setDateRange({ ...data, focusedInput: START_DATE });
        } else {
            setDateRange(data);
        }
    }

    const formatDate = (date: Date) => {
        if (date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);

            return `${day}/${month}/${year}`;
        } else return "";
    };

    const getDateString = (dates: {
        startDate: Date,
        endDate: Date,
    }): string => {
        if (!dateRange.startDate) {
            if (!dateRange.endDate) {
                return "";
            } else return formatDate(dateRange.endDate);
        }

        if (!dateRange.endDate) {
            if (!dateRange.startDate) {
                return "";
            } else return formatDate(dateRange.startDate);
        }

        const startDate = formatDate(dateRange.startDate);
        const endDate = formatDate(dateRange.endDate);
        if (dates.startDate.getTime() > dates.endDate.getTime()) {
            return `${startDate} - ${endDate}`;
        } else if (dates.startDate.getTime() < dates.endDate.getTime()) {
            return `${startDate} - ${endDate}`;
        } else return `${startDate}`;
    };

    const setToday = () => {
        setChoosedDates(getDateString({
            startDate: new Date(),
            endDate: new Date()
        }));
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
            focusedInput: START_DATE
        });
    };

    const clear = () => {
        setChoosedDates("");
    };

    useEffect(() => {
        setChoosedDates(getDateString({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        }));
    }, [dateRange]);

    return (
        <div className={cn(className, styles.datepickerWrapper)}
            {...props}
            ref={innerRef}
        >
            <DatepickerContext.Provider
                value={{
                    focusedDate,
                    isDateFocused,
                    isDateSelected,
                    isDateHovered,
                    isDateBlocked,
                    isFirstOrLastSelectedDate,
                    onDateSelect,
                    onDateFocus,
                    onDateHover
                }}
            >
                {/* <div>
                <strong>Focused input: </strong>
                {dateRange.focusedInput}
            </div>
            <div>
                <strong>Start date: </strong>
                {dateRange.startDate && dateRange.startDate.toLocaleString()}
            </div>
            <div>
                <strong>End date: </strong>
                {dateRange.endDate && dateRange.endDate.toLocaleString()}
            </div> */}

                <div
                    className={styles.activeMonthsArr}
                >
                    <div className={styles.navWrapper}>
                        <NavButton onClick={goToPreviousMonths}><ArrowIcon /></NavButton>
                        <NavButton onClick={goToNextMonths} className="rotate-180"><ArrowIcon /></NavButton>
                    </div>
                    {activeMonths.map(month => (
                        <Month
                            key={`${month.year}-${month.month}`}
                            year={month.year}
                            month={month.month}
                            firstDayOfWeek={firstDayOfWeek}
                        />
                    ))}
                    <div className="flex gap-6 mt-2">
                        <Button appearance="primary" size="s" onClick={setToday}>Сегодня</Button>
                        <Button appearance="ghost" size="s" onClick={clear}>Очистить</Button>
                    </div>
                </div>
            </DatepickerContext.Provider>
        </div>
    );
};


