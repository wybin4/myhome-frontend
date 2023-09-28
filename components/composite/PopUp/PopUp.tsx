import { PopUpProps } from "./PopUp.props";
import styles from "./PopUp.module.css";
import cn from 'classnames';
import { Htag, Icon, Paragraph } from "@/components";
import SuccessIcon from './success.svg';
import FailureIcon from './failure.svg';

export const PopUp = ({ className, children, type, ...props }: PopUpProps): JSX.Element => {
    return (
        <>
            <div className={cn(styles.popup, className, {
                [styles.success]: type === "success",
                [styles.failure]: type === "failure",
            })} {...props}>
                <Icon type="icon" appearance={type === "success" ? "green" : "red"} size="l" className={styles.logoIcon}>
                    {type === "success" && <SuccessIcon />}
                    {type === "failure" && <FailureIcon />}
                </Icon>
                <div className={styles.textBlock}>
                    <Htag size="h3" className={styles.title}>
                        {type === "success" && <>Отлично!</>}
                        {type === "failure" && <>Упс!</>}
                    </Htag>
                    <Paragraph size="s" className={styles.text}>{children}</Paragraph>
                </div>
            </div>
        </>
    );
};