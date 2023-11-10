import { InfoWindow } from "@/components";
import { getEnumValueByKey, downloadImage } from "@/helpers/constants";
import { IGetAppeal } from "@/interfaces/event.interface";
import { AppealStatus, AppealType, IAppeal } from "@/interfaces/event/appeal.interface";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import ProcessingIcon from "./processing.svg";
import ClosedIcon from "./closed.svg";
import RejectedIcon from "./rejected.svg";
import MeterIcon from "./meter.svg";
import QuestionIcon from "./question.svg";
import OtherIcon from "./other.svg";

export const getStatusIcon = (status: AppealStatus) => {
    switch (status) {
        case AppealStatus.Closed:
            return <ClosedIcon />;
        case AppealStatus.Processing:
            return <ProcessingIcon />;
        case AppealStatus.Rejected:
            return <RejectedIcon />;
        default: return (<></>);
    }
};

export const getTypeIcon = (type: string) => {
    switch (type) {
        case AppealType.AddIndividualMeter:
            return <MeterIcon />;
        case AppealType.VerifyIndividualMeter:
            return <MeterIcon />;
        case AppealType.ProblemOrQuestion:
            return <QuestionIcon />;
        case AppealType.Claim:
            return <OtherIcon className="!w-4" />;
        default: return (<></>);
    }
};

export const getInfoWindow = (
    appeals: IGetAppeal[],
    selectedId: number,
    isInfoWindowOpen: boolean, setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>,
    handleAppeal?: (id: number) => void
) => {
    const appeal = appeals.find(a => a.id === selectedId);
    if (appeal) {
        const { status, type, createdAt } = getFormattedAppealDate(appeal);
        const attachmentButton = getAttachment(appeal.attachment, String(appeal.createdAt), type, "info");
        const appealButton = getHandleAppeal(status, selectedId, handleAppeal);

        const buttons = (appealButton?.buttons ?? []).concat(attachmentButton?.buttons ?? []);

        return (
            <InfoWindow
                title={`Обращение №${appeal.id}`}
                description={`${appeal.name} | ${createdAt}`}
                text={appeal.data}
                tags={[status, type]}
                isOpen={isInfoWindowOpen}
                setIsOpen={setIsInfoWindowOpen}
                buttons={buttons}
            />
        );
    } else return <></>;
};

export const getFormattedAppealDate = (appeal: IAppeal) => {
    const status = getEnumValueByKey(AppealStatus, appeal.status);
    const type = getEnumValueByKey(AppealType, appeal.typeOfAppeal);
    const createdAt = format(new Date(appeal.createdAt), "dd.MM.yy");
    return { status, type, createdAt };
};

export const getAttachment = (attachment: string | undefined, date: string, appealType: string, place: "info" | "card") => {
    if (attachment !== undefined) {
        if (place === "card") {
            return {
                bottom: {
                    tag: appealType, attachment: "Вложение",
                    onClick: () => downloadImage(attachment, date)
                }
            };
        } else if (place === "info") {
            return {
                buttons: [
                    { name: "Скачать вложение", onClick: () => downloadImage(attachment, date) },
                ]
            };
        }
    } else {
        if (place === "card") {
            return {
                bottom: {
                    tag: appealType
                }
            };
        } else if (place === "info") {
            return undefined;
        }
    }
};

export const getHandleAppeal = (status: AppealStatus, id: number, handleAppeal?: (id: number) => void) => {
    if (handleAppeal && status === AppealStatus.Processing) {
        return {
            buttons: [
                { name: "Обработать обращение", onClick: () => handleAppeal(id) },
            ]
        };
    }
    return undefined;
};