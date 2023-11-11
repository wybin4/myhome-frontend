import { IReferenceData, IReferencePageComponent, IReferencePageItem } from "@/interfaces/reference/page.interface";
import axios from "axios";
import { format, isDate, isValid } from "date-fns";
import { FieldValues } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchReferenceData<T extends IReferenceData>
    (apiUrl: string, postData: any) {
    const { data } = await axios.post<{ data: T }>(apiUrl, postData);
    if (!data) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data
        }
    };
}

const parseValue = (value: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (dateRegex.test(value)) {
        return new Date(value);
    }
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
        return numberValue;
    }
    return value;
};

const valueFormat = (value: string | number | Date) => {
    if (typeof value === "string") {
        const parsed = parseValue(value);
        if (isDate(parsed) && isValid(parsed)) {
            return String(format(parsed as Date, 'dd.MM.yyyy'));
        } else return String(value);
    } else if (isDate(value) && isValid(value)) {
        return String(format(value, 'dd.MM.yyyy'));
    } else {
        return String(value);
    }
};

export const enrichReferenceComponent = <T extends FieldValues>(
    data: IReferenceData, item: IReferencePageComponent<T>, baseEngName: string
): IReferencePageComponent<T> => {
    const enrichedComponent = { ...item };
    const dataFromBack = data[baseEngName + "s"];
    if (dataFromBack) {
        const enrichedComponents = enrichedComponent.components.map(component => {
            const values = dataFromBack.map(item => item[component.id]);
            const rows = values.map(value => value ? valueFormat(value) : "");
            if (component.isFilter) {
                const uniqueValues = Array.from(new Set(values));
                const filterItems = [{
                    name: [{ word: component.title.map(t => t.word).join(" ") }],
                    items: uniqueValues.map(value => value ? valueFormat(value) : "")
                }];

                return {
                    ...component,
                    filterItems,
                    rows
                } as IReferencePageItem<T>;
            }
            return {
                ...component,
                rows
            };
        });

        return {
            ...enrichedComponent,
            components: enrichedComponents
        };
    }

    return enrichedComponent;
};