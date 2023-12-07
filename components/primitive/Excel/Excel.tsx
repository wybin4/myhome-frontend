/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ExcelProps } from "./Excel.props";
import styles from "./Excel.module.css";
import readXlsxFile from 'read-excel-file';
import { Attachment } from "../Attachment/Attachment";
import { capFirstLetter } from "@/helpers/constants";
import { isDate } from "date-fns";
import { formatDate } from "@/helpers/translators";

export const Excel = ({
    matchHeaders, selectors,
    table, setTable,
    text, fileFormat,
    clear, setClear,
    className, ...props
}: ExcelProps): JSX.Element => {
    const [file, setFile] = useState<File>();
    const [inputError, setInputError] = useState<string>("");

    useEffect(() => {
        setTable([]);
        setFile(undefined);
        setClear(false);
    }, [clear]);

    const handleFileUpload = async (file?: File) => {
        let err = "";

        if (file) {
            try {
                const dataArray = await readXlsxFile(file);
                const headers = dataArray[0];

                const matchValues = matchHeaders.map(mh => mh.value.toLowerCase());

                headers.map(h => {
                    if (!matchValues.includes(h.toString().toLowerCase())) {
                        err = "Неверные заголовки таблицы";
                    }
                });

                if (!err) {
                    const newData = dataArray.slice(1).map((row) => {
                        const obj: Record<string, any> = {};
                        headers.forEach((header, index) => {
                            obj[header.toString()] = row[index];
                        });

                        if (selectors) {
                            selectors.map(({ id, values }) => {
                                const currVal = values.find(v => {
                                    const currHeader = matchHeaders.find(h => h.name === id)?.value;
                                    return v.text === obj[capFirstLetter(currHeader || "")];
                                });

                                if (!currVal) {
                                    const currHeader = matchHeaders.find(mh => mh.name === id)?.value;
                                    err = `Неверно заданы значения для поля "${currHeader}"`;
                                }
                            });
                        }

                        return obj;
                    });
                    if (!err) {
                        setFile(file);
                        setTable(newData);
                        setInputError("");
                    }
                }
                setInputError(err);
            } catch (error: any) {
                setInputError(`Ошибка при чтении файла: ${error.message}`);
                setTable([]);
                setFile(undefined);
            }
        } else {
            setTable([]);
            setFile(undefined);
        }
    };

    return (
        <div className={className} {...props}>
            <Attachment text={text} fileFormat={fileFormat}
                file={file}
                handleFile={handleFileUpload}
                inputError={inputError}
                setInputError={setInputError}
                inputType="l"
            />
            {table.length > 0 && (
                <>
                    <div className={styles.viewText}>Просмотр</div>
                    <div className={styles.detailedPricing}>
                        <div className={styles.container}>
                            {Object.keys(table[0]).map((key) => (
                                <div
                                    key={key}
                                    className={styles.gridContainer}
                                    style={{ gridTemplateColumns: `100px repeat(${table.length ? table.length : 3}, minmax(0, 1fr))` }}
                                >
                                    <div className={styles.textGray}>{capFirstLetter(key)}</div>
                                    {table.map((data, index) => (
                                        <div key={index} className={styles.cell}>
                                            {Object.keys(data).map((key1, innerIndex) => {
                                                if (key1 === key) {
                                                    if (isDate(data[key1])) {
                                                        return <div key={innerIndex}>{formatDate(data[key1])}</div>;
                                                    } else {
                                                        return <div key={innerIndex}>{data[key1]}</div>;
                                                    }
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};