import { IReferenceData, IReferencePageComponent } from "@/interfaces/reference/page.interface";
import { format, isDate, isValid } from "date-fns";
import { FieldValues } from "react-hook-form";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { API, api } from "./api";
import { parse } from "cookie";
import { PAGE_LIMIT, getEnumValueByKey } from "./constants";
import { Dispatch, SetStateAction } from "react";
import { IFilter, ISearch } from "@/interfaces/meta.interface";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchReferenceData<T extends Record<string, string | number | any>>(
    { req, res }: GetServerSidePropsContext,
    apiUrl: string,
    postData: any,
    isMeta?: boolean
) {
    const getMeta = () => {
        if (isMeta) {
            return {
                meta: {
                    limit: PAGE_LIMIT,
                    page: 1
                }
            };
        }
    };

    const originalRequest = async (cookie?: string) => {
        return await axios.post<T>(
            `${process.env.NEXT_PUBLIC_DOMAIN}/${apiUrl}`, {
            ...postData,
            ...getMeta()
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



export const handleFilter = async (
    value: string[], id: string,
    uriToGet: string, postData: any,
    setPostData: (newData: any, isNew?: boolean, isGet?: boolean) => void,
    setItemOffset: Dispatch<SetStateAction<number>>,
    filters: IFilter[] | undefined,
    setFilters: Dispatch<SetStateAction<IFilter[] | undefined>>,
    search?: ISearch
) => {
    const getNewFilters = (filters: IFilter[] | undefined) => {
        if (filters && filters.length) {
            const existingFilterIndex = filters.findIndex((filter) => filter.filterField === id);
            if (value.length === 0) {
                if (existingFilterIndex !== -1) {
                    filters.splice(existingFilterIndex, 1);
                }
            } else {
                if (existingFilterIndex === -1) {
                    filters.push({ filterField: id, filterArray: value });
                } else {
                    filters.map(filter => {
                        if (filter.filterField === id) {
                            filter.filterArray = value;
                        }
                    });
                }
            }
            return [...filters];
        }
        return [{ filterField: id, filterArray: value }];
    };
    const newFilters = getNewFilters(filters);

    try {
        const { data } = await api.post(uriToGet, {
            meta: {
                limit: PAGE_LIMIT,
                page: 1,
                filters: newFilters,
                search
            },
            ...postData
        });
        setPostData(data, true, true);
    } catch (e) {
        setPostData([], true, true);
    }

    setItemOffset(0);
    setFilters(newFilters);
};

export const handleSearch = async (
    value: string, id: string,
    uriToGet: string, postData: any,
    setPostData: (newData: any, isNew?: boolean, isGet?: boolean) => void,
    setItemOffset: Dispatch<SetStateAction<number>>,
    setSearch: Dispatch<SetStateAction<ISearch | undefined>>,
    filters?: IFilter[]
) => {
    try {
        const { data } = await api.post(uriToGet, {
            meta: {
                limit: PAGE_LIMIT,
                page: 1,
                search: {
                    searchField: id,
                    searchLine: value
                },
                filters
            },
            ...postData
        });
        setPostData(data, true, true);
    } catch (e) {
        setPostData([], true, true);
    }

    setItemOffset(0);
    setSearch({
        searchField: id,
        searchLine: value
    });
};