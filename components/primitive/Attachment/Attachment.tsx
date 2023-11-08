import React, { ChangeEvent, ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { AttachmentProps, FileType } from "./Attachment.props";
import styles from "./Attachment.module.css";
import { PopUp } from "@/components";
import UploadIcon from "./upload.svg";
import PictureIcon from "./picture.svg";
import DeleteIcon from "./delete.svg";
import { bytesToSize } from "@/helpers/constants";
import cn from "classnames";

export const Attachment = forwardRef(({
    text, fileFormat,
    file, setFile,
    className, ...props
}: AttachmentProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    const [error, setError] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setIsPopupVisible(true);
        const timer = setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [file]);

    function clearFileInput() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            setFile(undefined);
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length === 1) {
            const file = selectedFiles[0];

            if (fileFormat.includes(file.type as FileType)) {
                setFile(file);
            } else {
                setError("Файл должен быть формата JPEG или PNG.");
            }
        } else {
            setError("Можно загрузить только один файл.");
        }
    };

    return (
        <div className={className} ref={ref} {...props}>
            {isPopupVisible &&
                <PopUp type="failure" isOpen={error !== ""} setIsOpen={() => setError("")}>
                    {error}
                </PopUp>
            }

            <div className={cn(styles.attachmentWrapper, {
                "!hidden": file
            })}>
                <div className={styles.wrapperText}>
                    <span className={styles.uploadIcon}><UploadIcon /></span>
                    <div>
                        <div className={styles.text}>{text}</div>
                        <div className={styles.description}>{Object.keys(FileType).join(" или ")}</div>
                    </div>
                </div>
                <label className={styles.realInput}>
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                        className={styles.fakeInput}
                        ref={fileInputRef}
                        name="file"
                    />
                    Загрузить
                </label>
            </div>

            {file &&
                <div className={styles.fileWrapper}>
                    <span className={styles.deleteIcon} onClick={clearFileInput}><DeleteIcon /></span>
                    <div className={styles.wrapperText}>
                        <span className={styles.pictureIcon}><PictureIcon /></span>
                        <div>
                            <div className={styles.text}>{file.name}</div>
                            <div className={styles.description}>{bytesToSize(file.size)}</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
});