import { ChangeEvent, ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newInputValue = e.target.value;
        setChoosedDates(newInputValue);
    };

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
                value={choosedDates || ""}
                onChange={handleInputChange}
                readOnly={true}
                inputError={inputError}
                ref={ref}
            />
            {isPickerOpened &&
                <DatePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    setChoosedDates={setChoosedDates}
                    className="mt-3"
                />
            }
        </div>
    );
});
