import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import CalendarIcon from '../calendar.svg';
import { START_DATE } from '@datepicker-react/hooks';
import { Input } from '../../Input/Input';
import styles from '../DatePicker.module.css';
import { NavButton } from "./NavButton";
import { FocusedInput, useDatepicker } from "@datepicker-react/hooks";
import { Month } from "./Month";
import DatepickerContext from "../helpers/datepickerContext";
import ArrowIcon from '../arrow.svg';
import { DatePickerIProps, DatePickerInputProps, IDateInput } from "../DatePicker.props";
import { Button } from '../../Button/Button';
import cn from "classnames";

export const DatePickerInput = forwardRef(({
    choosedDate, setChoosedDate, numberInOrder,
    inputTitle, inputSize = "s", inputError,
    className,
    ...props
}: DatePickerInputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
    const [isPickerOpened, setIsPickerOpened] = useState<boolean>(false);
    const [date, setDate] = useState<IDateInput>({
        date: new Date(),
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

    const setToday = () => {
        setChoosedDate(new Date());
        setDate({
            date: new Date(),
            focusedInput: START_DATE
        });
    };

    const clear = () => {
        setChoosedDate(undefined);
    };

    useEffect(() => {
        if (setChoosedDate) {
            setChoosedDate(date.date);
        }
    }, [date]);

    return (
        <div className={cn(styles.pickerWrapper, className)} {...props} ref={pickerRef}>
            <Input
                title={inputTitle}
                placeholder=""
                onClick={() => setIsPickerOpened(!isPickerOpened)}
                size={inputSize}
                sizeOfIcon="big"
                icon={<CalendarIcon />}
                alignOfIcon="right"
                value={choosedDate ? formatDate(choosedDate) : ""}
                datePicker={true}
                inputError={inputError}
                ref={ref}
            />
            {isPickerOpened &&
                <DatePickerI
                    date={date}
                    setDate={setDate}
                    setToday={setToday}
                    clear={clear}
                    className="mt-3"
                    numberInOrder={numberInOrder}
                />
            }
        </div>
    );
});

const DatePickerI = ({
    innerRef,
    date, setDate,
    className, numberInOrder,
    setToday, clear,
    ...props
}: DatePickerIProps): JSX.Element => {
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
        startDate: date.date,
        endDate: date.date,
        focusedInput: date.focusedInput,
        onDatesChange: handleDateChange,
        numberOfMonths: 1,
    });


    function handleDateChange(data: {
        startDate: Date,
        endDate: Date,
        focusedInput: FocusedInput
    }) {
        setDate({ date: data.startDate, focusedInput: START_DATE });
    }

    return (
        <div className={cn(className, {
            [styles.datepickerWrapperBottom]: numberInOrder === undefined || numberInOrder <= 3,
            [styles.datepickerWrapperTop]: numberInOrder && numberInOrder > 3,
        })}
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



