import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface AttachmentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    fileFormat: FileType[];
    fileType?: "image" | "file";

    inputType?: "l" | "s";

    file: File | undefined;

    inputError?: string;
    setInputError?: React.Dispatch<React.SetStateAction<string>>;

    handleFile: (file?: File) => void;
}

export enum FileType {
    PNG = "png",
    JPEG = "jpeg",
    JPG = "jpg",
    CSV = "csv",
    TXT = "txt",
    XLSX = "xlsx",
}