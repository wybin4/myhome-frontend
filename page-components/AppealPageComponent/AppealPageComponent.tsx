import { Card, CardForm, Form, Htag, TableButton, TableFilter, Tabs } from "@/components";
import { AttachmentFormProps, TextAreaFormProps, InputFormProps, SelectorFormProps, DatePickerFormProps } from "@/components/enhanced/Form/Form.props";
import { FileType } from "@/components/primitive/Attachment/Attachment.props";
import { API } from "@/helpers/api";
import { getEnumKeyByValue, getEnumValueByKey } from "@/helpers/constants";
import { ITypeOfService } from "@/interfaces/common.interface";
import { IGetAppeal } from "@/interfaces/event.interface";
import { AppealStatus, AppealType, IAppeal } from "@/interfaces/event/appeal.interface";
import { IGetIndividualMeter, MeterType } from "@/interfaces/reference/meter.interface";
import { IApartmentAllInfo } from "@/interfaces/reference/subscriber/apartment.interface";
import axios from "axios";
import { AppealPageComponentProps, AppealDetailPageComponentProps } from "./AppealPageComponent.props";
import ArrowIcon from "./arrow.svg";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getStatusIcon, getAttachment, getInfoWindow, getTypeIcon, getFormattedAppealDate } from "./constants";
import { UserRole } from "@/interfaces/account/user.interface";
import styles from "./AppealPageComponent.module.css";
import { TableFilterItemProps } from "@/components/composite/TableFilter/TableFilter.props";

export const AppealPageComponent = ({ appeals, users, user }: AppealPageComponentProps): JSX.Element => {
    const [selectedId, setSelectedId] = useState<number>(0);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);



    switch (user.userRole) {
        case UserRole.ManagementCompany:
            return (
                <AppealManagementCompanyPageComponent
                    user={user}
                    selectedId={selectedId} setSelectedId={setSelectedId}
                    isInfoWindowOpen={isInfoWindowOpen} setIsInfoWindowOpen={setIsInfoWindowOpen}
                    appeals={appeals}
                />
            );
        case UserRole.Owner:
            return (
                <AppealOwnerPageComponent
                    user={user}
                    users={users}
                    selectedId={selectedId} setSelectedId={setSelectedId}
                    isInfoWindowOpen={isInfoWindowOpen} setIsInfoWindowOpen={setIsInfoWindowOpen}
                    appeals={appeals}
                />
            );
        default:
            return (<></>);
    }
};



export const AppealOwnerPageComponent = ({
    appeals, users,
    selectedId, setSelectedId,
    isInfoWindowOpen, setIsInfoWindowOpen,
    user
}: AppealDetailPageComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(1);
    const useFormData = useForm<IAppeal>();
    const [selectedAppealType, setSelectedAppealType] = useState<string>("");
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);
    const [isCardFormOpened, setIsCardFormOpened] = useState<boolean>(false);
    const [selectedSubscriberId, setSelectedSubscriberId] = useState<number>(0);
    const [selectedMCId, setSelectedMCId] = useState<number>(0);
    const [typesOfService, setTypesOfService] = useState<ITypeOfService[]>();
    const [apartments, setApartments] = useState<IApartmentAllInfo[]>();
    const [subscribers, setSubscribers] = useState<{
        id: number;
        address: string;
    }[]>();
    const [meters, setMeters] = useState<IGetIndividualMeter[]>();

    const getAppeals = (appealStatus: AppealStatus | "all"): JSX.Element => {
        if (appealStatus !== "all") {
            const status = getEnumKeyByValue(AppealStatus, appealStatus);
            appeals = appeals.filter(a => a.status === status);
        }

        appeals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return (
            <div className="flex flex-col gap-6">
                {appeals.map((appeal, key) => {
                    const { status, type, createdAt } = getFormattedAppealDate(appeal);

                    return (
                        <Card
                            key={key}
                            maxWidth="38.375rem"
                            titlePart={{
                                text: `№${appeal.id}`,
                                tag: {
                                    tag: status,
                                    tagIcon: getStatusIcon(status)
                                },
                                description: `${appeal.name} · ${createdAt}`,
                                symbolRight: {
                                    symbol: <span className="viewAction"><ArrowIcon /></span>,
                                    size: "l",
                                    onClick: () => {
                                        setSelectedId(appeal.id);
                                        setIsInfoWindowOpen(!isInfoWindowOpen);
                                    }
                                },
                            }}
                            text={appeal.data}
                            isMobileText={false}
                            {...getAttachment(appeal.attachment, String(appeal.createdAt), type, "card")}
                        />
                    );
                })}
            </div>
        );
    };

    const handleSelectClick = (option: string | number, type: AppealType) => {
        switch (type) {
            case AppealType.ProblemOrQuestion:
            case AppealType.Claim: {
                const mcId = parseInt(String(option));
                setSelectedMCId(mcId);
                const subscribers = users?.filter(u => u.user.id === option).flatMap(u => u.subscribers);
                setSubscribers(subscribers);
                break;
            }
            case AppealType.VerifyIndividualMeter: {
                const meterId = parseInt(String(option));
                const meter = meters?.find(m => m.id === meterId);
                if (meter) {
                    const subscriberId = meter.subscriberId;
                    const userWithSubscribers = users?.find(user => user.subscribers.some(s => s.id === subscriberId));
                    if (userWithSubscribers) {
                        const mcId = userWithSubscribers.user.id;
                        setSelectedMCId(mcId ? mcId : 0);
                        setSelectedSubscriberId(subscriberId);
                    }
                } else {
                    console.log("Что-то пошло не так"); // ИСПРАВИТЬ
                }
                break;
            }
            case AppealType.AddIndividualMeter: {
                const apartmentId = parseInt(String(option));
                const apartment = apartments?.find(a => a.id === apartmentId);
                if (apartment) {
                    const subscriberId = apartment.subscriberId;
                    const userWithSubscribers = users?.find(user => user.subscribers.some(s => s.id === subscriberId));
                    if (userWithSubscribers) {
                        const mcId = userWithSubscribers.user.id;
                        setSelectedMCId(mcId ? mcId : 0);
                        setSelectedSubscriberId(subscriberId);
                    }
                }
                break;
            }
        }
    };

    const getData = async (type: AppealType) => {
        switch (type) {
            case getEnumKeyByValue(AppealType, AppealType.VerifyIndividualMeter): {
                try {
                    if (!meters) {
                        const { data } = await axios.post<{ meters: IGetIndividualMeter[] }>(
                            API.subscriber.meter.get, {
                            userId: user.userId,
                            userRole: user.userRole,
                            meterType: MeterType.Individual,
                            isNotAllInfo: true
                        });
                        if (!data) {
                            console.log("Что-то пошло не так");
                        } else {
                            setMeters(data.meters);
                        }
                    }
                }
                catch (e) {
                    console.log(e); // ИСПРАВИТЬ
                }
                break;
            }
            case getEnumKeyByValue(AppealType, AppealType.AddIndividualMeter): {
                try {
                    if (!typesOfService) {
                        const { data } = await axios.post<{ typesOfService: ITypeOfService[] }>(
                            API.reference.typeOfService.get);
                        if (!data) {
                            console.log("Что-то пошло не так");
                        } else {
                            setTypesOfService(data.typesOfService);
                        }
                    }
                    if (!apartments) {
                        const { data } = await axios.post<{ apartments: IApartmentAllInfo[] }>(
                            API.subscriber.apartment.get, {
                            userId: user.userId,
                            userRole: user.userRole,
                            isAllInfo: true
                        });
                        if (!data) {
                            console.log("Что-то пошло не так");
                        } else {
                            setApartments(data.apartments);
                        }
                    }
                }
                catch (e) {
                    console.log(e); // ИСПРАВИТЬ
                }
                break;
            }
        }
    };

    const getForm = (type: AppealType): {
        attachments?: AttachmentFormProps<IAppeal>[];
        textAreas?: TextAreaFormProps<IAppeal>[];
        inputs?: InputFormProps<IAppeal>[];
        selectors?: SelectorFormProps<IAppeal>[];
        datePickers?: DatePickerFormProps<IAppeal>[];
    } | undefined => {
        switch (type) {
            case getEnumKeyByValue(AppealType, AppealType.ProblemOrQuestion):
            case getEnumKeyByValue(AppealType, AppealType.Claim): {
                return {
                    selectors:
                        [{
                            inputTitle: "Управляющая компания",
                            options: users ? users?.map(u => {
                                return {
                                    value: u.user.id ? u.user.id : 0,
                                    text: u.user.name ? u.user.name : ""
                                };
                            }) : [],
                            id: "managementCompanyId",
                            type: "select",
                            numberInOrder: 1,
                            error: {
                                value: true, message: "Выберите управляющую компанию"
                            },
                            handleSelect: (option: string | number) => {
                                handleSelectClick(option, AppealType.Claim);
                            }
                        },
                        {
                            inputTitle: "Квартира",
                            options: subscribers ? subscribers.map(s => {
                                return {
                                    value: s.id,
                                    text: s.address
                                };
                            }) : [],
                            id: "subscriberId",
                            type: "select",
                            numberInOrder: 2,
                            error: {
                                value: true, message: "Выберите квартиру"
                            },
                            handleSelect: (option: string | number) => {
                                setSelectedSubscriberId(parseInt(String(option)));
                            }
                        }],
                    textAreas:
                        [{
                            title: "Подробности",
                            id: "text",
                            type: "textarea",
                            numberInOrder: 3,
                            error: {
                                value: true, message: "Введите текст обращения"
                            }
                        }]
                };
            }
            case getEnumKeyByValue(AppealType, AppealType.VerifyIndividualMeter): {
                return {
                    selectors:
                        [{
                            inputTitle: "Счётчик",
                            options: meters ? meters.map(m => {
                                return {
                                    value: m.id,
                                    text: `${m.address} ИПУ ${m.typeOfServiceName}`
                                };
                            }) : [],
                            id: "meterId",
                            type: "select",
                            numberInOrder: 1,
                            error: {
                                value: true, message: "Выберите счётчик"
                            },
                            handleSelect: (option: string | number) => {
                                handleSelectClick(option, AppealType.VerifyIndividualMeter);
                            }
                        }],
                    datePickers: [{
                        inputTitle: "Дата поверки",
                        id: "verifiedAt",
                        type: "datepicker",
                        numberInOrder: 2,
                        error: {
                            value: true, message: "Выберите дату поверки"
                        },
                    }],
                    attachments: [{
                        text: "Акт поверки",
                        fileFormat: [FileType.JPEG, FileType.PNG],
                        id: "attachment",
                        type: "attachment",
                        numberInOrder: 3,
                        error: {
                            value: true, message: "Добавьте вложение"
                        },
                    }]
                };
            }
            case getEnumKeyByValue(AppealType, AppealType.AddIndividualMeter):
                return {
                    selectors:
                        [{
                            inputTitle: "Тип услуги",
                            options: typesOfService ? typesOfService.map(tos => {
                                return {
                                    value: tos.id,
                                    text: tos.name
                                };
                            }) : [],
                            id: "typeOfServiceId",
                            type: "select",
                            numberInOrder: 1,
                            error: {
                                value: true, message: "Выберите тип услуги"
                            },
                        },
                        {
                            inputTitle: "Квартира",
                            options: apartments ? apartments.map(a => {
                                return {
                                    value: a.id,
                                    text: a.address
                                };
                            }) : [],
                            id: "apartmentId",
                            type: "select",
                            numberInOrder: 2,
                            error: {
                                value: true, message: "Выберите квартиру"
                            },
                            handleSelect: (option: string | number) => {
                                handleSelectClick(option, AppealType.AddIndividualMeter);
                            }
                        }],
                    datePickers: [{
                        inputTitle: "Дата поверки",
                        id: "verifiedAt",
                        type: "datepicker",
                        numberInOrder: 4,
                        error: {
                            value: true, message: "Выберите дату поверки"
                        },
                    },
                    {
                        inputTitle: "Дата истечения поверки",
                        id: "issuedAt",
                        type: "datepicker",
                        numberInOrder: 5,
                        error: {
                            value: true, message: "Выберите дату истечения поверки"
                        },
                    }],
                    inputs: [{
                        title: "Заводской номер",
                        inputType: "string",
                        id: "factoryNumber",
                        type: "input",
                        numberInOrder: 3,
                        error: {
                            value: true, message: "Введите заводской номер"
                        }
                    }],
                    attachments: [{
                        text: "Паспорт счётчика",
                        fileFormat: [FileType.JPEG, FileType.PNG],
                        id: "attachment",
                        type: "attachment",
                        numberInOrder: 6,
                        error: {
                            value: true, message: "Добавьте вложение"
                        },
                    }]
                };
            default:
                return undefined;
        }
    };

    const getDataList = (type: AppealType): string[] | undefined => {
        switch (type) {
            case getEnumKeyByValue(AppealType, AppealType.ProblemOrQuestion): {
                return ["text"];
            }
            case getEnumKeyByValue(AppealType, AppealType.Claim): {
                return ["text"];
            }
            case getEnumKeyByValue(AppealType, AppealType.VerifyIndividualMeter): {
                return ["meterId", "verifiedAt", "attachment"];
            }
            case getEnumKeyByValue(AppealType, AppealType.AddIndividualMeter):
                return ["typeOfServiceId", "apartmentId", "verifiedAt", "issuedAt", "factoryNumber", "attachment"];
            default:
                return undefined;
        }
    };

    return (
        <>
            {selectedId !== 0 && getInfoWindow(appeals, selectedId, isInfoWindowOpen, setIsInfoWindowOpen)}
            <CardForm
                title="Выбор типа обращения"
                items={Object.keys(AppealType).map(key => {
                    const value = String(getEnumValueByKey(AppealType, key));
                    return {
                        key,
                        value,
                        icon: getTypeIcon(value)
                    };
                })}
                isOpened={isCardFormOpened}
                setIsOpened={setIsCardFormOpened}
                next={() => {
                    setIsCardFormOpened(!isCardFormOpened);
                    setIsFormOpened(!isFormOpened);
                }}
                selected={selectedAppealType}
                setSelected={async (selected: string) => {
                    setSelectedAppealType(selected);
                    await getData(selected as AppealType);
                }}
            />
            {selectedAppealType !== "" &&
                <Form<IAppeal>
                    successMessage={"Обращение отправлено"}
                    successCode={201}
                    additionalFormData={
                        [{
                            managementCompanyId: selectedMCId,
                            typeOfAppeal: selectedAppealType,
                            subscriberId: selectedSubscriberId
                        }]
                    }
                    urlToPost={API.subscriber.appeal.add}
                    useFormData={useFormData}
                    isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                    title={"Отправка обращения"}
                    oneRow={true}
                    dataList={getDataList(selectedAppealType as AppealType)}
                    setPostData={(newData: { appeal: IGetAppeal }) => {
                        appeals.push(newData.appeal);
                    }}
                    {...getForm(selectedAppealType as AppealType)}
                />
            }
            <Tabs
                title="Обращения"
                tabs={[
                    { id: 1, name: "Все" },
                    { id: 2, name: "В обработке" },
                    { id: 3, name: "Обработанные" },
                    { id: 4, name: "Отклоненные" },
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
                addButtonText="обращение"
                onAddButtonClick={() => setIsCardFormOpened(!isCardFormOpened)}
            >
                {activeTab === 1 && getAppeals("all")}
                {activeTab === 2 && getAppeals(AppealStatus.Processing)}
                {activeTab === 3 && getAppeals(AppealStatus.Closed)}
                {activeTab === 4 && getAppeals(AppealStatus.Rejected)}
            </Tabs>
        </>
    );
};

export const AppealManagementCompanyPageComponent = ({
    appeals,
    selectedId, setSelectedId,
    isInfoWindowOpen, setIsInfoWindowOpen,
}: AppealDetailPageComponentProps): JSX.Element => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const [type, setType] = useState<string[]>();
    const [status, setStatus] = useState<string[]>();
    const filterButtonRef = useRef(null);

    const getAppeals = (): JSX.Element => {
        appeals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return (
            <div className="flex flex-col gap-6">
                {appeals.map((appeal, key) => {
                    const { status, type, createdAt } = getFormattedAppealDate(appeal);

                    return (
                        <Card
                            key={key}
                            maxWidth="38.375rem"
                            titlePart={{
                                text: `№${appeal.id}`,
                                tag: {
                                    tag: status,
                                    tagIcon: getStatusIcon(status)
                                },
                                description: `${appeal.name} · ${createdAt}`,
                                symbolRight: {
                                    symbol: <span className="viewAction"><ArrowIcon /></span>,
                                    size: "l",
                                    onClick: () => {
                                        setSelectedId(appeal.id);
                                        setIsInfoWindowOpen(!isInfoWindowOpen);
                                    }
                                },
                            }}
                            text={appeal.data}
                            isMobileText={false}
                            {...getAttachment(appeal.attachment, String(appeal.createdAt), type, "card")}
                        />
                    );
                })}
            </div>
        );
    };

    type AppealData = {
        typeArr: string[];
        statusArr: string[];
    };

    useEffect(() => {
        const initialData: AppealData = {
            typeArr: [],
            statusArr: [],
        };

        const appealsData: AppealData = appeals.reduce(
            (accumulator, appeal) => {
                const statusItem = getEnumValueByKey(AppealStatus, appeal.status);
                accumulator.statusArr.push(statusItem);
                const typeItem = getEnumValueByKey(AppealType, appeal.typeOfAppeal);
                accumulator.typeArr.push(typeItem);
                return accumulator;
            },
            initialData
        );

        const { typeArr, statusArr } = appealsData;
        setType(Array.from(new Set(typeArr)));
        setStatus(Array.from(new Set(statusArr)));

    }, [appeals]);

    const filters: TableFilterItemProps[] = [
        {
            title: "Дата",
            titleEng: "createdAt",
            type: "date"
        },
        {
            title: "Тип обращения",
            titleEng: "type",
            type: "checkbox",
            items: type
        },
        {
            title: "Статус",
            titleEng: "status",
            type: "checkbox",
            items: status
        }
    ];

    return (
        <>
            <div className={styles.topPart}>
                <Htag size="h1" className={styles.title}>Обращения</Htag>
                <TableButton buttons={[]}
                    isFiltersExist={filters !== undefined}
                    filterButtonRef={filterButtonRef}
                    isFilterOpened={isFilterOpened} setIsFilterOpened={setIsFilterOpened}
                />
            </div>
            {filters &&
                <TableFilter
                    isOpen={isFilterOpened}
                    setIsOpen={setIsFilterOpened}
                    title="Фильтры"
                    items={filters}
                    className={styles.filter}
                    filterButtonRef={filterButtonRef}
                />}
            {selectedId !== 0 && getInfoWindow(appeals, selectedId, isInfoWindowOpen, setIsInfoWindowOpen)}
            {getAppeals()}
        </>
    );
};
