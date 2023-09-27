import styles from '../DatePicker.module.css';
import { NavButton } from "./NavButton";
import { FocusedInput, START_DATE, useDatepicker } from "@datepicker-react/hooks";
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
    setToday, clear,
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


