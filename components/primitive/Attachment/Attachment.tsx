import React, { ChangeEvent, ForwardedRef, forwardRef, useRef } from "react";
import { AttachmentProps, FileType } from "./Attachment.props";
import styles from "./Attachment.module.css";
import UploadIcon from "./upload.svg";
import PictureIcon from "./picture.svg";
import DeleteIcon from "./delete.svg";
import { bytesToSize, getEnumKeyByValue } from "@/helpers/constants";
import cn from "classnames";

export const Attachment = forwardRef(({
    text, fileFormat, fileType = "image",
    file, inputError, handleFile, setInputError,
    inputType = "s",
    className, ...props
}: AttachmentProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    function clearFileInput(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            if (handleFile) {
                handleFile(undefined);
            }
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length === 1) {
            const file = selectedFiles[0];
            const fileNameParts = file.name.split('.');
            const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
            if (fileFormat.includes(fileExtension as FileType)) {
                if (handleFile) {
                    handleFile(file);
                }
                setInputError && setInputError("");
            } else {
                setInputError && setInputError(`Файл должен быть формата ${fileFormat.join(" или ")}.`);
            }
        } else {
            setInputError && setInputError("Можно загрузить только один файл.");
        }
    };


    const getOrString = (arr: string[]) => {
        return arr.map((value, index) => index < arr.length - 2 ? `${value}, ` : index === arr.length - 2 ? `${value} или ` : `${value}`).join('');
    };

    return (
        <div className={className} ref={ref} {...props}>
            <div className={cn(styles.attachmentWrapper, {
                "!hidden": file,
                [styles.inputError]: inputError,
                [styles.s]: inputType === "s",
                [styles.l]: inputType === "l"
            })}>
                <div className={styles.wrapperText}>
                    <span className={styles.uploadIcon}><UploadIcon /></span>
                    <div>
                        <div className={styles.text}>{text}</div>
                        <div className={styles.description}>{getOrString(fileFormat.map(f => getEnumKeyByValue(FileType, f)))}</div>
                    </div>
                </div>
                <label className={styles.realInput}>
                    <input
                        type="file"
                        accept={fileFormat.join(", ")}
                        onChange={handleFileChange}
                        className={styles.fakeInput}
                        ref={fileInputRef}
                        name="file"
                    />
                    Загрузить
                </label>
            </div>

            {file && fileType === "image" &&
                <div className={styles.fileWrapper}>
                    <span className={styles.deleteIcon} onClick={(e) => clearFileInput(e)}><DeleteIcon /></span>
                    <div className={styles.wrapperText}>
                        <span className={styles.pictureIcon}><PictureIcon /></span>
                        <div>
                            <div className={styles.text}>{file.name}</div>
                            <div className={styles.description}>{bytesToSize(file.size)}</div>
                        </div>
                    </div>
                </div>
            }
            {inputError && <span className={styles.error}>{inputError}</span>}
        </div>
    );
});