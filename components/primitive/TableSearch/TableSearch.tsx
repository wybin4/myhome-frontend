import { SearchProps, TableSearchProps } from "./TableSearch.props";
import SearchIcon from './search.svg';
import { Input } from "../Input/Input";
import { SetStateAction, useState } from "react";

export const TableSearch = ({
    title, id, handleSearch,
    className, ...props
}: TableSearchProps): JSX.Element => {
    const [value, setValue] = useState<string | number | undefined>();

    const handleChange = (value: SetStateAction<string | number | undefined>) => {
        setValue(value);
        handleSearch(String(value), id);
    };

    return (
        <div {...props}>
            <Input
                value={value}
                setValue={handleChange}
                placeholder={`Поиск по ${title}`} inputType="string"
                size="l"
                className={className} icon={<SearchIcon />} />
        </div>
    );
};

export const Search = ({
    value, setValue,
    placeholder = "Поиск", size,
    className, ...props
}: SearchProps): JSX.Element => {

    return (
        <div {...props}>
            <Input
                value={value}
                setValue={setValue}
                placeholder={placeholder} inputType="string"
                size={size}
                className={className} icon={<SearchIcon />} />
        </div>
    );
};