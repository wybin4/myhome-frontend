import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfProps } from './Pdf.props';
import styles from "./Pdf.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export const Pdf = ({ pdfUrl, ...props }: PdfProps) => {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handleNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };


    return (
        <div className={styles.wrapper} {...props}>
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
        </div>
    );
};