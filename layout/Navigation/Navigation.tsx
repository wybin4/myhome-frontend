import { NavigationProps } from "./Navigation.props";
// import styles from "./Navigation.module.css";
// import cn from 'classnames';

export const Navigation = ({ ...props }: NavigationProps): JSX.Element => {
    return (
        <>
            <div {...props}>
                Navigation
            </div>
        </>
    );
};