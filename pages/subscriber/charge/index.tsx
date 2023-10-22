// import { Table, Tabs } from "@/components";
// import { withLayout } from "@/layout/Layout";
// import { MouseEventHandler, useState } from "react";
// import PdfIcon from "./pdf.svg";
// import { bytesToSize, downloadPdf, monthNamesInNominativeCase } from "@/helpers/constants";
// import { UserRole } from "@/interfaces/account/user.interface";
// import { API } from "@/helpers/api";
// import axios from "axios";

import { Tabs } from "@/components";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";

function Charge(): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <>
            <Tabs
                title="Начисления"
                tabs={[
                    { id: 1, name: "Оплата" },
                    { id: 2, name: "Графики" },
                    { id: 3, name: "Квитанции" },
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
            >
                {activeTab === 1 &&
                    <div>Оплата</div>
                }
                {activeTab === 2 &&
                    <div>Графики</div>
                }
                {activeTab === 3 &&
                    <div>Квитанции</div>
                }
            </Tabs>
        </>
    );
}

export default withLayout(Charge);

// function Charge({ data }: IChargeProps): JSX.Element {
//     const [activeTab, setActiveTab] = useState<number>(1);

//     type SPDData = {
//         apartmentNames: string[],
//         spdNames: string[];
//         spdIds: number[];
//         fileSizes: string[];
//     };

//     const initialData: SPDData = {
//         apartmentNames: [],
//         spdNames: [],
//         spdIds: [],
//         fileSizes: [],
//     };

//     const result: SPDData = data.singlePaymentDocuments.reduce(
//         (accumulator, spd) => {
//             accumulator.apartmentNames.push(spd.apartmentName);

//             const date = new Date(spd.createdAt);
//             const monthNumber = date.getMonth();
//             const year = date.getFullYear();

//             accumulator.spdNames.push(
//                 `${monthNamesInNominativeCase[monthNumber]} ${year}`
//             );

//             accumulator.spdIds.push(spd.id);

//             const fileSize = bytesToSize(spd.fileSize);
//             accumulator.fileSizes.push(fileSize);

//             return accumulator;
//         },
//         initialData
//     );

//     const {
//         apartmentNames,
//         spdNames,
//         spdIds,
//         fileSizes
//     } = result;

//     const download: MouseEventHandler<HTMLDivElement> = (event) => {
//         const spd = data.singlePaymentDocuments.find(s => s.id === Number(event.currentTarget.id));
//         if (spd && spd.pdfBuffer) {
//             downloadPdf(spd.pdfBuffer, String(spd.createdAt));
//         }
//     };

//     return (
//         <>
//             <Tabs
//                 title="Начисления"
//                 tabs={[
//                     { id: 1, name: "Оплата" },
//                     { id: 2, name: "Графики" },
//                     { id: 3, name: "Квитанции" },
//                 ]}
//                 activeTab={activeTab} setActiveTab={setActiveTab}
//             >
//                 {activeTab === 3 &&
//                     <div>
//                         <Table title="" rows={{
//                             startIcon: <PdfIcon />,
//                             actions: {
//                                 actions: [{
//                                     type: "download",
//                                     onClick: download,
//                                     id: 0
//                                 }]
//                             },
//                             ids: spdIds,
//                             items: [
//                                 {
//                                     title: "Квитанция",
//                                     type: "text",
//                                     items: spdNames
//                                 },
//                                 {
//                                     title: "Квартира",
//                                     type: "text",
//                                     items: apartmentNames
//                                 },
//                                 {
//                                     title: "Размер",
//                                     type: "text",
//                                     items: fileSizes
//                                 }
//                             ],
//                             keyElements: { first: [3], second: 1, isSecondNoNeedTitle: true }
//                         }} />
//                     </div>
//                 }
//             </Tabs>
//         </>
//     );
// }

// export async function getServerSideProps() {
//     const apiUrl = API.subscriber.singlePaymentDocument.get;
//     const postData = {
//         subscriberIds: [1] // ИСПРАВИТЬ!!!!
//     };

//     try {
//         const { data } = await axios.post<{ singlePaymentDocuments: ISpdData[] }>(apiUrl, postData);
//         if (!data) {
//             return {
//                 notFound: true
//             };
//         }
//         return {
//             props: {
//                 data
//             }
//         };
//     } catch {
//         return {
//             notFound: true
//         };
//     }
// }

// interface IChargeProps extends Record<string, unknown> {
//     data: { singlePaymentDocuments: ISpdData[] };
//     role: UserRole;
// }

// interface ISpdData {
//     id: number;
//     apartmentName: string;
//     fileSize: number;
//     pdfBuffer: string;
//     createdAt: Date;
// }