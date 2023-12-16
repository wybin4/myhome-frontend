/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExcelHeader } from "@/components/primitive/Excel/Excel.props";
import { IAppContext } from "@/context/app.context";
import { API, api } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { enrichReferenceComponent, fetchReferenceData, handleSearch } from "@/helpers/reference-constants";
import { IUserReferenceData, IUserReferenceDataItem, managementCompanyPageComponent } from "@/interfaces/account/user.interface";
import { IPenaltyRuleReferenceDataItem, penaltyRulePageComponent } from "@/interfaces/correction/penalty.interface";
import { ISearch } from "@/interfaces/meta.interface";
import { IReferenceData, IReferencePageComponent } from "@/interfaces/reference/page.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent, getPagination, setPostDataForReference } from "@/page-components";
import { isDate } from "date-fns";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import writeExcelFile from "write-excel-file";

function ReferencePage({ data: initialData }: ReferencePageProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [engName, setEngName] = useState<string>("");
    const router = useRouter();
    const [itemOffset, setItemOffset] = useState(0);
    const [search, setSearch] = useState<ISearch>();

    const getEngName = () => {
        let engName = router.asPath.split("/")[3];
        switch (engName) {
            case "management-company":
                engName = "profile";
                break;
        }
        return engName;
    };

    useEffect(() => {
        setEngName(getEngName());
    }, [router.asPath]);

    const createComponent = <T extends FieldValues>(
        item: IReferencePageComponent<T>, entityName: string, baseEngName: string,
        uriToAdd: string,
        uriToGet: string
    ) => {
        const endOffset = itemOffset + PAGE_LIMIT;
        const newItem = enrichReferenceComponent(data, item, baseEngName, itemOffset, endOffset);

        const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
            setPostDataForReference(setData, baseEngName, newData, isNew, isGet);
        };

        return (
            <>
                <ReferencePageComponent<T>
                    key={newItem.engName}
                    item={newItem}
                    uriToAdd={uriToAdd}
                    entityName={entityName}
                    handleFilter={async () => { }}
                    handleSearch={async (value: string, id: string) => {
                        await handleSearch(
                            value, id,
                            uriToGet, undefined, setPostData,
                            setItemOffset, setSearch
                        );
                    }}
                    isData={initialData.totalCount !== null || data.totalCount !== 0}
                    setPostData={setPostData}
                    downloadAllData={async (headers: ExcelHeader[]) => {
                        const { data } = await api.post(uriToGet, item.additionalGetFormData);
                        const excelHeaders = headers.map(h => { return { value: h.value }; });
                        const dataArr = data[baseEngName + "s"];
                        const excelData = dataArr.map((obj: { [x: string]: any; }) => {
                            return headers.map(header => {
                                const key = header.name;
                                const value = obj[key];

                                let type = undefined;

                                if (typeof value === 'number') {
                                    type = Number;
                                } else if (isDate(value)) {
                                    type = Date;
                                } else if (typeof value === "string") {
                                    type = String;
                                }

                                if (type) {
                                    if (type === Date) {
                                        return {
                                            type: type,
                                            value: new Date(value),
                                            format: 'dd/mm/yyyy',
                                        };
                                    } else {
                                        return {
                                            type: type,
                                            value: value,
                                        };
                                    }
                                }
                            });
                        });
                        const url = `${new Date().getTime()}.xlsx`;

                        writeExcelFile([excelHeaders, ...excelData], { fileName: url })
                            .then(() => {
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = url;
                                document.body.appendChild(a);
                            });
                        return;
                    }}
                />
                {getPagination(
                    setItemOffset, data, initialData, baseEngName + "s",
                    uriToGet, item.additionalGetFormData, setPostData,
                    search
                )}
            </>

        );
    };

    return (
        <>
            {engName === "penalty-calculation-rule" && createComponent<IPenaltyRuleReferenceDataItem>(
                penaltyRulePageComponent, "penaltyRule", "penaltyRule",
                API.admin.correction.penaltyCalculationRule.add,
                API.managementCompany.correction.penaltyRule.getMany || ""
            )}
            {engName === "profile" && createComponent<IUserReferenceDataItem>(
                managementCompanyPageComponent, "user", "profile",
                API.common.user.addMany,
                API.common.user.getAll
            )}
        </>
    );
}

export default withLayout(ReferencePage);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const url = context.resolvedUrl || "";
    const engName = url.split("/")[3];

    let apiUrl: string = '';
    switch (engName) {
        case "management-company":
            apiUrl = API.common.user.getAll;
            break;
        case "penalty-calculation-rule": {
            apiUrl = API.managementCompany.correction.penaltyRule.getMany || "";
            break;
        }
    }

    try {
        switch (engName) {
            case "management-company": {
                return await fetchReferenceData<IUserReferenceData>(context, apiUrl, managementCompanyPageComponent.additionalGetFormData, true);
            }
            case "penalty-calculation-rule":
                return await fetchReferenceData<IPenaltyRuleReferenceDataItem>(context, apiUrl, undefined, true);
            default:
                return {
                    notFound: true
                };
        }
    } catch {
        return {
            notFound: true
        };
    }
}

interface ReferencePageProps extends Record<string, unknown>, IAppContext {
    data: IReferenceData & { totalCount: number; };
}