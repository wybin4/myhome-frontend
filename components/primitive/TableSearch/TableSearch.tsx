import { TableSearchProps } from "./TableSearch.props";
import SearchIcon from './search.svg';
import { Input } from "../Input/Input";

export const TableSearch = ({
    value, setValue,
    placeholder = "Поиск", size,
    className, ...props
}: TableSearchProps): JSX.Element => {

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