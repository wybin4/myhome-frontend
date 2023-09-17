import styles from "./DatePicker.module.css";
import { NavButton } from "./NavButton";
import { FocusedInput, START_DATE, useDatepicker } from "@datepicker-react/hooks";
import { useState } from "react";
import { Month } from "./Month";
import DatepickerContext from "./datepickerContext";
import ArrowIcon from './arrow.svg';

export const DatePicker = (): JSX.Element => {
    const [state, setState] = useState<{
        startDate: Date,
        endDate: Date,
        focusedInput: FocusedInput
    }>({
        startDate: new Date(),
        endDate: new Date(),
        focusedInput: START_DATE
    });
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
        startDate: state.startDate,
        endDate: state.endDate,
        focusedInput: state.focusedInput,
        onDatesChange: handleDateChange,
    });

    function handleDateChange(data: {
        startDate: Date,
        endDate: Date,
        focusedInput: FocusedInput
    }) {
        if (!data.focusedInput) {
            setState({ ...data, focusedInput: START_DATE });
        } else {
            setState(data);
        }
    }

    const currMonth = activeMonths[0];

    // const activeMonthsArrStyle = {
    //     gridTemplateColumns: `repeat(${activeMonths.length}, 300px)`
    // };

    return (
        <div className={styles.datepickerWrapper}
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
                {state.focusedInput}
            </div>
            <div>
                <strong>Start date: </strong>
                {state.startDate && state.startDate.toLocaleString()}
            </div>
            <div>
                <strong>End date: </strong>
                {state.endDate && state.endDate.toLocaleString()}
            </div> */}

                <div
                    className={styles.activeMonthsArr}
                // style={activeMonthsArrStyle}
                >
                    <div className={styles.navWrapper}>
                        <NavButton onClick={goToPreviousMonths}><ArrowIcon /></NavButton>
                        <NavButton onClick={goToNextMonths} className="rotate-180"><ArrowIcon /></NavButton>
                    </div>
                    <Month
                        key={`${currMonth.year}-${currMonth.month}`}
                        year={currMonth.year}
                        month={currMonth.month}
                        firstDayOfWeek={firstDayOfWeek}
                    />
                    {/* {activeMonths.map(month => (
                        <Month
                            key={`${month.year}-${month.month}`}
                            year={month.year}
                            month={month.month}
                            firstDayOfWeek={firstDayOfWeek}
                        />
                    ))} */}
                </div>
            </DatepickerContext.Provider>
        </div>
    );
};


