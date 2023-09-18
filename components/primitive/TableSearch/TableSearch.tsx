import { TableSearchProps } from "./TableSearch.props";
import SearchIcon from './search.svg';
import { Input } from "../Input/Input";

export const TableSearch = ({ className, size, ...props }: TableSearchProps): JSX.Element => {
    return (
        <>
            <Input placeholder="Поиск" size={size} className={className} icon={<SearchIcon />} />
        </>
    );
};