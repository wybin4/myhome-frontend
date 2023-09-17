import { MonthProps } from "./DatePicker.props";
import styles from './DatePicker.module.css';
import { Day } from "./Day";
import { useMonth } from "@datepicker-react/hooks";
import { translateMonthToRussian, translateWeekdayToRussian } from "./translators";

export const Month = ({ year, month, firstDayOfWeek }: MonthProps): JSX.Element => {
    const { days, weekdayLabels, monthLabel } = useMonth({
        year,
        month,
        firstDayOfWeek
    });

    return (
        <div>
            <div className={styles.monthLabel}>
                <strong>{translateMonthToRussian(monthLabel)}</strong>
            </div>
            <div
                className={styles.weekdayLabelsArr}
            >
                {weekdayLabels.map(dayLabel => (
                    <div className="text-center" key={dayLabel}>
                        {translateWeekdayToRussian(dayLabel)}
                    </div>
                ))}
            </div>
            <div
                className={styles.daysArr}
            >
                {days.map((day, index) => {
                    if (typeof day === "object") {
                        return (
                            <Day
                                date={day.date}
                                key={day.date.toString()}
                                dayLabel={day.dayLabel}
                            />
                        );
                    }

                    return <div key={index} />;
                })}
            </div>
        </div>
    );
};
