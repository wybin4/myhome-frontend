import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import CalendarIcon from '../calendar.svg';
import { START_DATE } from '@datepicker-react/hooks';
import { DatePickerRProps, DatePickerRangeProps, IDateRange } from '../DatePicker.props';
import { Input } from '../../Input/Input';
import styles from '../DatePicker.module.css';
import { NavButton } from "./NavButton";
import { FocusedInput, useDatepicker } from "@datepicker-react/hooks";
import { Month } from "./Month";
import DatepickerContext from "../helpers/datepickerContext";
import ArrowIcon from '../arrow.svg';
import { Button } from '../../Button/Button';
import cn from "classnames";

export const DatePickerRange = forwardRef(({
    choosedDates, setChoosedDates,
    title, size = "s", inputError,
    ...props
}: DatePickerRangeProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
    const [isPickerOpened, setIsPickerOpened] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<IDateRange>({
        startDate: new Date(),
        endDate: new Date(),
        focusedInput: START_DATE
    });

    const pickerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target as Node | null)) {
            setIsPickerOpened(false);
        }
    };

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
        if (!dateRange.startDate || !dates) {
            if (!dateRange.endDate) {
                return "";
            } else return formatDate(dateRange.endDate);
        }

        if (!dateRange.endDate || !dates) {
            if (!dateRange.startDate) {
                return "";
            } else return formatDate(dateRange.startDate);
        }

        const startDate = formatDate(dateRange.startDate);
        const endDate = formatDate(dateRange.endDate);
        if (!dates.startDate || !dates.endDate) {
            return "";
        }
        if (dates.startDate.getTime() > dates.endDate.getTime()) {
            return `${startDate} - ${endDate}`;
        } else if (dates.startDate.getTime() < dates.endDate.getTime()) {
            return `${startDate} - ${endDate}`;
        } else return `${startDate}`;
    };

    const setToday = () => {
        setChoosedDates({
            startDate: new Date(),
            endDate: new Date()
        });
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
            focusedInput: START_DATE
        });
    };

    const clear = () => {
        setChoosedDates(undefined);
    };

    useEffect(() => {
        if (setChoosedDates) {
            setChoosedDates({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
        }
    }, [dateRange]);

    return (
        <div {...props} ref={pickerRef}>
            <Input
                title={title}
                placeholder=""
                onClick={() => setIsPickerOpened(!isPickerOpened)}
                size={size}
                sizeOfIcon="big"
                icon={<CalendarIcon />}
                alignOfIcon="right"
                value={choosedDates ? getDateString(choosedDates) : ""}
                readOnly={true}
                inputError={inputError}
                ref={ref}
            />
            {isPickerOpened &&
                <DatePickerR
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    setToday={setToday}
                    clear={clear}
                    className="mt-3"
                />
            }
        </div>
    );
});

const DatePickerR = ({
    innerRef,
    dateRange, setDateRange,
    className,
    setToday, clear,
    ...props
}: DatePickerRProps): JSX.Element => {

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
                        <Button appearance="primary" size="s" onClick={setToday} type="button">Сегодня</Button>
                        <Button appearance="ghost" size="s" onClick={clear} type="button">Очистить</Button>
                    </div>
                </div>
            </DatepickerContext.Provider>
        </div>
    );
};


