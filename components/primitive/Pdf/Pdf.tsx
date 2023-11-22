import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfProps } from './Pdf.props';
import styles from "./Pdf.module.css";
import { Button } from '../Button/Button';
import PrintIcon from "./print.svg";
import cn from "classnames";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export const Pdf = ({ pdfUrl, print, back, ...props }: PdfProps) => {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1); // ИСПРАВИТЬ
    const [width, setWidth] = useState<number>(0);
    const pdfWrapperRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);
    const [scaleInput, setScaleInput] = useState<string>(Math.round(scale * 100) + "%");

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const download = () => {
        const a = document.createElement('a');
        a.href = pdfUrl.url;
        a.download = `${new Date(pdfUrl.date).getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(pdfUrl.url);
    };

    // const handleNextPage = () => {
    //     if (pageNumber < numPages) {
    //         setPageNumber(pageNumber + 1);
    //     }
    // };

    // const handlePreviousPage = () => {
    //     if (pageNumber > 1) {
    //         setPageNumber(pageNumber - 1);
    //     }
    // };

    const handleScaleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        const sanitizedValue = inputValue.replace(/\D+/g, '');
        setScaleInput(sanitizedValue + "%");
        const parsedValue = parseInt(sanitizedValue);
        setScale(parsedValue / 100);
    };

    const setDivSize = () => {
        if (pdfWrapperRef.current) {
            const newWidth = pdfWrapperRef.current.getBoundingClientRect().width;
            setWidth(newWidth <= 800 ? newWidth : 800);
        }
    };

    useEffect(() => {
        setDivSize();
        window.addEventListener("resize", setDivSize);

        return () => {
            window.removeEventListener("resize", setDivSize);
        };
    }, []);

    const zoomOut = () => {
        if (scale > 0.3) {
            setScaleInput(Math.round((scale - 0.2) * 100) + "%");
            setScale(scale - 0.2);
        }
    };

    const zoomIn = () => {
        if (scale < 5) {
            setScaleInput(Math.round((scale + 0.2) * 100) + "%");
            setScale(scale + 0.2);
        }
    };

    return (
        <div className={styles.wrapper} ref={pdfWrapperRef} {...props}>
            <div className={styles.topWrapper}>
                {back &&
                    <Button
                        onClick={back}
                        className={cn(styles.download, "ml-4 self-center")} appearance="primary" size="s"
                    >Назад</Button>
                }
                <div className={styles.zoom}>
                    <button onClick={zoomOut}>
                        -
                    </button>
                    <input
                        className={cn(
                            styles.scaleInput,
                            "focus:ring-4 focus:ring-violet-100"
                        )}
                        value={scaleInput}
                        onChange={handleScaleInput}
                    />
                    <button onClick={zoomIn}>
                        +
                    </button>
                </div>
                <div className={styles.foo}>
                    <div className={styles.print} onClick={print}><PrintIcon /></div>
                    <Button
                        onClick={download}
                        size="s"
                        className={styles.download} appearance="primary">Скачать</Button>
                </div>
            </div>
            <div className={styles.pdfWrapper}>
                <Document
                    className={styles.document}
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page
                        className={styles.page}
                        scale={scale}
                        pageNumber={pageNumber} width={width}
                        renderAnnotationLayer={false} renderTextLayer={false}
                    />
                </Document>
            </div>
            <p>Page {pageNumber} of {numPages}</p>
        </div>
    );
};