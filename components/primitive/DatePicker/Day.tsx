import { useRef, useContext } from "react";
import { DayProps } from "./DatePicker.props";
import styles from './DatePicker.module.css';
import { useDay } from "@datepicker-react/hooks";
import DatepickerContext from "./datepickerContext";
import cn from "classnames";

export const Day = ({ dayLabel, date }: DayProps): JSX.Element => {
    const dayRef = useRef(null);
    const {
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover
    } = useContext(DatepickerContext);
    const {
        isSelected,
        isSelectedStartOrEnd,
        isWithinHoverRange,
        // disabledDate,
        onClick,
        onKeyDown,
        onMouseEnter,
        tabIndex
    } = useDay({
        date,
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateFocus,
        onDateSelect,
        onDateHover,
        dayRef
    });

    if (!dayLabel) {
        return <div />;
    }

    return (
        <button
            onClick={onClick}
            onKeyDown={onKeyDown}
            onMouseEnter={onMouseEnter}
            tabIndex={tabIndex}
            type="button"
            ref={dayRef}
            className={cn(styles.day, styles.normalColor, {
                [styles.selectedFirstOrLastColor]: isSelectedStartOrEnd,
                [styles.selectedColor]: isSelected,
                [styles.rangeHoverColor]: isWithinHoverRange
            })}
        >
            {dayLabel}
        </button>
    );
};