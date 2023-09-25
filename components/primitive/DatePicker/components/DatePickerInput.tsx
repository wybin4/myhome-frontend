import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DatePicker } from './DatePicker';
import CalendarIcon from '../calendar.svg';
import { START_DATE } from '@datepicker-react/hooks';
import { DatePickerInputProps, IDateRange } from '../DatePicker.props';
import { Input } from '../../Input/Input';

export const DatePickerInput = ({
    inputTitle, inputSize = "s", ...props
}: DatePickerInputProps): JSX.Element => {
    const [isPickerOpened, setIsPickerOpened] = useState<boolean>(false);
    const [choosedDates, setChoosedDates] = useState<string>("");
    const [dateRange, setDateRange] = useState<IDateRange>({
        startDate: new Date(),
        endDate: new Date(),
        focusedInput: START_DATE
    });

    const inputRef = useRef<HTMLInputElement | null>(null);
    const pickerRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newInputValue = e.target.value;
        setChoosedDates(newInputValue);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                inputRef.current !== event.target
            ) {
                setIsPickerOpened(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div {...props}>
            <Input
                title={inputTitle}
                placeholder=""
                onClick={() => setIsPickerOpened(!isPickerOpened)}
                size={inputSize}
                sizeOfIcon="big" icon={<CalendarIcon />}
                value={choosedDates}
                onChange={handleInputChange}
                readOnly={true}
                innerRef={inputRef}
            />
            {isPickerOpened &&
                <DatePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    setChoosedDates={setChoosedDates}
                    className="mt-3"
                    innerRef={pickerRef} />
            }
        </div>
    );
};