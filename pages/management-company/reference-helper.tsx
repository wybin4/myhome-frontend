/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from "@/components";
import { api } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { IFilter, ISearch } from "@/interfaces/meta.interface";
import { Dispatch, SetStateAction } from "react";

export const getPagination = (
    setItemOffset: Dispatch<SetStateAction<number>>,
    data: any, initialData: any, name: string, uriToGet: string,
    postData: any, setPostData: (newData: any, isNew?: boolean, isGet?: boolean) => void,
    search?: ISearch, filters?: IFilter[]
) => {
    const handlePaginate = async (
        selected: number,
    ) => {
        if (data.totalCount !== data[name].length) {
            const { data } = await api.post(uriToGet, {
                meta: {
                    limit: PAGE_LIMIT,
                    page: selected + 1,
                    search, filters,
                },
                ...postData
            });
            setPostData(data, false, true);
        }
    };

    return (
        <>
            {(data.totalCount !== null && initialData.totalCount !== null) &&
                <Pagination
                    handlePaginate={handlePaginate}
                    setItemOffset={setItemOffset}
                    itemsCount={data.totalCount || 0}
                    itemsPerPage={PAGE_LIMIT}
                />
            }
        </>
    );
};

export const setPostDataForEvent = (
    setData: React.Dispatch<React.SetStateAction<any>>,
    name: string,
    newData: any,
    isNew?: boolean,
    isGet?: boolean
) => {
    const nameWithS = name + "s";
    setData((prevData: { [x: string]: any; totalCount: number; }) => {
        if (!isGet) {
            const updatedProperty = [
                ...prevData[nameWithS],
                newData[name],
            ];

            return {
                ...prevData,
                [nameWithS]: updatedProperty,
                totalCount: prevData.totalCount ? prevData.totalCount + 1 : 1,
            };
        } else {
            const dataCount = newData.events[nameWithS].totalCount;
            const newTotalCount = dataCount !== 0 ? dataCount : null;
            const newProp = newData.events[nameWithS][nameWithS];

            return {
                ...prevData,
                [nameWithS]: isNew ? [...newProp] : [...prevData[nameWithS], ...newProp],
                totalCount: newTotalCount,
            };
        }
    });
};

export const setPostDataForReference = (
    setData: React.Dispatch<React.SetStateAction<any>>,
    name: string,
    newData: any,
    isNew?: boolean,
    isGet?: boolean
) => {
    const nameWithS = name + "s";
    setData((prevData: { [x: string]: any; totalCount: number; }) => {
        if (!isGet) {
            const updatedProperty = [
                ...prevData[nameWithS],
                newData[name],
            ];

            return {
                ...prevData,
                [nameWithS]: updatedProperty,
                totalCount: prevData.totalCount ? prevData.totalCount + 1 : 1,
            };
        } else {
            const dataCount = newData.totalCount;
            const newTotalCount = dataCount !== 0 ? dataCount : null;
            const newProp = newData[nameWithS];

            return {
                ...prevData,
                [nameWithS]: isNew ? [...newProp] : [...prevData[nameWithS], ...newProp],
                totalCount: newTotalCount,
            };
        }
    });
};
