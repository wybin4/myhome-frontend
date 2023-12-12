import { IReferenceData, IReferencePageComponent, IReferencePageItem } from "@/interfaces/reference/page.interface";
import { format, isDate, isValid } from "date-fns";
import { FieldValues } from "react-hook-form";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { API } from "./api";
import { parse } from "cookie";
import { PAGE_LIMIT, getEnumValueByKey } from "./constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchReferenceData<T extends Record<string, string | number | any>>(
    { req, res }: GetServerSidePropsContext,
    apiUrl: string,
    postData: any
) {
    const originalRequest = async (cookie?: string) => {
        return await axios.post<T>(
            `${process.env.NEXT_PUBLIC_DOMAIN}/${apiUrl}`, {
            ...postData,
            meta: {
                limit: PAGE_LIMIT,
                page: 1
            }
        },
            {
                withCredentials: true,
                headers: {
                    Cookie: [req.headers.cookie, cookie].join(";"),
                }
            });
    };
    try {
        const { data } = await originalRequest();
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
    catch (error: any) {
        if (error.response.status === 401) {
            try {
                const refresh = await axios.get(API.auth.refresh, {
                    baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
                    withCredentials: true,
                    headers: {
                        Cookie: req.headers.cookie,
                    }
                });
                const cookie = refresh.headers["set-cookie"] || [""];
                const token = parse(cookie.join())["token"];
                res.setHeader("set-cookie", cookie);
                const response = await originalRequest("token=" + token);
                if (!response.data) {
                    return {
                        notFound: true
                    };
                }
                return {
                    props: {
                        data: response.data
                    }
                };
            } catch (e) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: false
                    }
                };
            }
        }
    }
    return {
        props: {
            data: {}
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
    data: IReferenceData, item: IReferencePageComponent<T>, baseEngName: string,
    start?: number, end?: number
): IReferencePageComponent<T> => {
    const enrichedComponent = { ...item };
    let dataFromBack = data[baseEngName + "s"];
    dataFromBack = dataFromBack.slice(start, end);
    if (dataFromBack) {
        const enrichedComponents = enrichedComponent.components.map(component => {
            const values = dataFromBack.map(item =>
                component.enum ?
                    getEnumValueByKey(component.enum, String(item[component.id]) || "")
                    : item[component.id]);
            const rows = values.map(value => value ? valueFormat(value) : "");
            if (component.isFilter) {
                const uniqueValues = Array.from(new Set(values));
                const filterItems = [{
                    name: [{ word: component.title.map(t => t.word).join(" ") }],
                    items: uniqueValues.map(value => {
                        return {
                            value: component.id,
                            text: value ? valueFormat(value) : ""
                        };
                    })
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