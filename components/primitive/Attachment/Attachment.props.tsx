import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface AttachmentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    fileFormat: FileType[];

    file: File;
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export enum FileType {
    PNG = "image/png",
    JPEG = "image/jpeg"
}