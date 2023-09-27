import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import { DatePicker } from './DatePicker';
import CalendarIcon from '../calendar.svg';
import { START_DATE } from '@datepicker-react/hooks';
import { DatePickerInputProps, IDateRange } from '../DatePicker.props';
import { Input } from '../../Input/Input';

export const DatePickerInput = forwardRef(({
    choosedDates, setChoosedDates,
    inputTitle, inputSize = "s", inputError,
    ...props
}: DatePickerInputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
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
                title={inputTitle}
                placeholder=""
                onClick={() => setIsPickerOpened(!isPickerOpened)}
                size={inputSize}
                sizeOfIcon="big"
                icon={<CalendarIcon />}
                alignOfIcon="right"
                value={choosedDates ? getDateString(choosedDates) : ""}
                readOnly={true}
                inputError={inputError}
                ref={ref}
            />
            {isPickerOpened &&
                <DatePicker
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
