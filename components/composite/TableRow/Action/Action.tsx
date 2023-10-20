import { ActionProps, ViewActionProps } from "./Action.props";
import DownloadIcon from "../icons/download.svg";
import ArrowIcon from "../icons/arrow.svg";
import CommentIcon from "../icons/comment.svg";
import ViewIcon from "../icons/view.svg";
import DeleteIcon from "../icons/delete.svg";
import EditIcon from "../icons/edit.svg";
import styles from "./Action.module.css";

export const Action = ({ actions, isMobile = false, ...props }: ActionProps): JSX.Element => {
    const isOnlyView = actions.length > 1 ? false : true;

    return (
        <div className={styles.actions} >
            {actions && actions.map((action, index) => {
                switch (action.type) {
                    case "editAndSave":
                        return <div key={index} {...props} onClick={action.onClick}><EditIcon /></div>;
                    case "delete":
                        return <div key={index} {...props} onClick={action.onClick}><DeleteIcon /></div>;
                    case "addComment":
                        return <div key={index} {...props} onClick={action.onClick}><CommentIcon className={styles.comment} /></div>;
                    case "download":
                        return <div key={index} {...props} onClick={action.onClick}><DownloadIcon /></div>;
                    case "view":
                        return (
                            <ViewAction
                                key={index}
                                item={isMobile ? <ArrowIcon /> : isOnlyView ?
                                    "Просмотр" : <ViewIcon />
                                }
                                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                    action.onClick(e);
                                    if (action.setSelectedId) {
                                        action.setSelectedId(action.id);
                                    }
                                }}
                            />
                        );
                }
            })}
        </div>
    );
};

export const ViewAction = ({ item, onClick, ref, ...props }: ViewActionProps): JSX.Element => {
    return (
        <div
            onClick={onClick}
            className="viewAction"
            ref={ref}
            {...props}>
            {item}
        </div>
    );
};