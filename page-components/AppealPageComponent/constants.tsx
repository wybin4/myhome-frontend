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
    isInfoWindowOpen: boolean, setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>
) => {
    const appeal = appeals.find(a => a.id === selectedId);
    if (appeal) {
        const { status, type, createdAt } = getFormattedAppealDate(appeal);

        return (
            <InfoWindow
                title={`Обращение №${appeal.id}`}
                description={`${appeal.name} | ${createdAt}`}
                text={appeal.data}
                tags={[status, type]}
                isOpen={isInfoWindowOpen}
                setIsOpen={setIsInfoWindowOpen}
                {...getAttachment(appeal.attachment, String(appeal.createdAt), type, "info")}
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
                buttons: [{ name: "Скачать вложение", onClick: () => downloadImage(attachment, date) }]
            };
        }
    } else return;
};