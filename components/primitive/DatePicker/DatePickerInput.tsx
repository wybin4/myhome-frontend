import { ChangeEvent, useState } from 'react';
import { Input } from '../Input/Input';
import { DatePicker } from './DatePicker';
import CalendarIcon from './calendar.svg';
import { START_DATE } from '@datepicker-react/hooks';
import { IDateRange } from './DatePicker.props';

export const DatePickerInput = (): JSX.Element => {
    const [isPickerOpened, setIsPickerOpened] = useState<boolean>(false);
    const [choosedDates, setChoosedDates] = useState<string>("");
    const [dateRange, setDateRange] = useState<IDateRange>({
        startDate: new Date(),
        endDate: new Date(),
        focusedInput: START_DATE
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newInputValue = e.target.value;
        setChoosedDates(newInputValue);
    };

    return (
        <>
            <Input placeholder=""
                onClick={() => setIsPickerOpened(!isPickerOpened)}
                size="s"
                sizeOfIcon="big" icon={<CalendarIcon />}
                value={choosedDates}
                onChange={handleInputChange}
                readOnly={true}
            />
            {isPickerOpened &&
                <DatePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    setChoosedDates={setChoosedDates}
                    className="mt-3" />
            }
        </>
    );
};