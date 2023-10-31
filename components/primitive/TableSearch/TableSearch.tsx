import { TableSearchProps } from "./TableSearch.props";
import SearchIcon from './search.svg';
import { Input } from "../Input/Input";

export const TableSearch = ({ placeholder = "Поиск", className, size, ...props }: TableSearchProps): JSX.Element => {
    return (
        <>
            <Input placeholder={placeholder} inputType="string" size={size} className={className} icon={<SearchIcon />} />
        </>
    );
};