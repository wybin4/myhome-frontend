import { Card, Form, Htag, InfoWindow, PopUp, Tabs } from "@/components";
import { withLayout } from "@/layout/Layout";
import HeatingIcon from "./icons/heating.svg";
import WaterIcon from "./icons/water.svg";
import ElectricityIcon from "./icons/electricity.svg";
import ArrowIcon from "./icons/arrow.svg";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";
import { API, api } from "@/helpers/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { MeterType } from "@/interfaces/reference/meter.interface";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { IAppContext } from "@/context/app.context";
import NoDataIcon from "./icons/nodata.svg";
import { FileType } from "@/components/primitive/Attachment/Attachment.props";
import { AppealType, IAppeal } from "@/interfaces/event/appeal.interface";
import { ITypeOfService } from "@/interfaces/common.interface";
import { IApartmentAllInfo, IGetApartment } from "@/interfaces/reference/subscriber/apartment.interface";
import { getEnumKeyByValue } from "@/helpers/constants";
import { IGetUserWithSubscriber } from "@/interfaces/account/user.interface";
import { AxiosError } from "axios";
import { formatDate } from "@/helpers/translators";

function isDaysRemainingLessThan(dateString: Date, numb: number) {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference < numb;
}

function Meter({ data }: MeterPageProps): JSX.Element {
    const [apartmentId, setApartmentId] = useState<number>(data.meters[0].apartmentId);
    const [isAddFormOpened, setIsAddFormOpened] = useState<boolean>(false);
    const [isUpdateFormOpened, setIsUpdateFormOpened] = useState<boolean>(false);
    const [selectedSubscriberId, setSelectedSubscriberId] = useState<number>(0);
    const [selectedMCId, setSelectedMCId] = useState<number>(0);
    const useUpdateFormData = useForm<IAppeal>();
    const useAddFormData = useForm<IAppeal>();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedMeterId, setSelectedMeterId] = useState<number>(0);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsPopupVisible(true);

        const timer = setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [error, success]);

    const tabs = data.meters.map(obj => {
        return {
            name: "Квартира " + obj.apartmentNumber,
            id: obj.apartmentId
        };
    });

    const selectedData = data.meters.find(obj => obj.apartmentId === apartmentId);

    const isData = (meters: IGetMeterByAIDs[]) => {
        return meters.filter(apartment => apartment.meters.length > 0).length > 0;
    };
    const isDataVal = isData(data.meters);

    const handleSelectClick = (option: string | number) => {
        const apartmentId = parseInt(String(option));
        if (data.apartments.length) {
            const apartment = data.apartments.find(a => a.id === apartmentId);
            if (apartment) {
                const subscriberId = apartment.subscriberId;
                if (data.users.length) {
                    const userWithSubscribers = data.users.find(user => user.subscribers.some(s => s.id === subscriberId));
                    if (userWithSubscribers) {
                        const mcId = userWithSubscribers.user.id;
                        setSelectedMCId(mcId ? mcId : 0);
                        setSelectedSubscriberId(subscriberId);
                    }
                }
            }
        }
    };

    const handleUpdateFormSend = () => {
        if (data.meters) {
            const apartment = data.meters.find(m => m.meters.find(mm => mm.id === selectedMeterId));
            if (apartment && data.apartments.length) {
                const apartmentInList = data.apartments.find(a => a.id === apartment.apartmentId);
                if (apartmentInList) {
                    const subscriberId = apartmentInList.subscriberId;
                    if (data.users) {
                        const userWithSubscribers = data.users.find(user => user.subscribers.some(s => s.id === subscriberId));
                        if (userWithSubscribers) {
                            const mcId = userWithSubscribers.user.id;
                            return {
                                managementCompanyId: mcId,
                                subscriberId: subscriberId
                            };
                        }
                    }
                }
            }
        }
    };

    const getInfoWindow = (
    ) => {
        if (selectedData) {
            const meter = selectedData.meters.find(m => m.id === selectedMeterId);
            if (meter) {
                const isIssued = isDaysRemainingLessThan(meter.issuedAt, 3); // ИСПРАВИТЬ

                return (
                    <InfoWindow
                        title={meter.typeOfServiceName}
                        description=""
                        text={
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium" style={{ color: "var(--grey)" }}>Дата поверки</div>
                                    <div>{formatDate(new Date(meter.verifiedAt))}</div>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium" style={{ color: "var(--grey)" }}>Дата истечения поверки</div>
                                    <div className={cn({
                                        "text-red-500": isIssued
                                    })}>{formatDate(new Date(meter.issuedAt))}</div>
                                </div>
                                {isIssued && <div className="text-red-500 text-right">Внимание! До конца срока поверки осталось менее 3 дней</div>}
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium" style={{ color: "var(--grey)" }}>Текущее показание</div>
                                    <div>{meter.readings.current}</div>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium" style={{ color: "var(--grey)" }}>Предыдущее показание</div>
                                    <div>{meter.readings.previous}</div>
                                </div>
                            </div>
                        }
                        tags={[meter.factoryNumber, meter.unitName]}
                        isOpen={isInfoWindowOpen}
                        setIsOpen={setIsInfoWindowOpen}
                        buttons={[{
                            name: "Изменить дату поверки",
                            onClick: () => {
                                setIsUpdateFormOpened(!isUpdateFormOpened);
                                setIsInfoWindowOpen(false);
                            }
                        }]}
                    />
                );
            }
        }
        return <></>;
    };

    return (
        <>
            <Form
                useFormData={useUpdateFormData}
                isOpened={isUpdateFormOpened} setIsOpened={setIsUpdateFormOpened}
                title="Поверка счётчика"
                additionalFormData={
                    {
                        typeOfAppeal: getEnumKeyByValue(AppealType, AppealType.VerifyIndividualMeter),
                        meterId: selectedMeterId,
                        ...(handleUpdateFormSend() || {})
                    }
                }
                dataList={["meterId", "verifiedAt", "issuedAt", "attachment"]}
                datePickers={[{
                    title: "Дата поверки",
                    id: "verifiedAt",
                    type: "datepicker",
                    numberInOrder: 2,
                    error: {
                        value: true, message: "Выберите дату поверки"
                    },
                },
                {
                    title: "Дата истечения поверки",
                    id: "issuedAt",
                    type: "datepicker",
                    numberInOrder: 3,
                    error: {
                        value: true, message: "Выберите дату истечения поверки"
                    },
                }
                ]}
                attachments={[{
                    text: "Акт поверки",
                    fileFormat: [FileType.JPEG, FileType.JPG, FileType.PNG],
                    id: "attachment",
                    type: "attachment",
                    numberInOrder: 4,
                    error: {
                        value: true, message: "Добавьте вложение"
                    },
                }]}
                urlToPost={API.subscriber.appeal.add}
                successCode={201}
                successMessage="Обращение на поверку счётчика успешно добавлено"
            >
            </Form>
            <Form
                useFormData={useAddFormData}
                isOpened={isAddFormOpened} setIsOpened={setIsAddFormOpened}
                title="Добавление счётчика"
                additionalFormData={
                    {
                        managementCompanyId: selectedMCId,
                        typeOfAppeal: getEnumKeyByValue(AppealType, AppealType.AddIndividualMeter),
                        subscriberId: selectedSubscriberId
                    }
                }
                dataList={["typeOfServiceId", "apartmentId", "verifiedAt", "issuedAt", "factoryNumber", "attachment"]}
                selectors=
                {[{
                    title: "Тип услуги",
                    options: data.typesOfService ? data.typesOfService.map(tos => {
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
                    title: "Квартира",
                    options: data.apartments ? data.apartments.map(a => {
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
                        handleSelectClick(option);
                    }
                }
                ]}
                datePickers={[{
                    title: "Дата поверки",
                    id: "verifiedAt",
                    type: "datepicker",
                    numberInOrder: 4,
                    error: {
                        value: true, message: "Выберите дату поверки"
                    },
                },
                {
                    title: "Дата истечения поверки",
                    id: "issuedAt",
                    type: "datepicker",
                    numberInOrder: 5,
                    error: {
                        value: true, message: "Выберите дату истечения поверки"
                    },
                }]}
                inputs={[{
                    title: "Заводской номер",
                    inputType: "string",
                    id: "factoryNumber",
                    type: "input",
                    numberInOrder: 3,
                    error: {
                        value: true, message: "Введите заводской номер"
                    }
                }]}
                attachments={[{
                    text: "Паспорт счётчика",
                    fileFormat: [FileType.JPEG, FileType.JPG, FileType.PNG],
                    id: "attachment",
                    type: "attachment",
                    numberInOrder: 6,
                    error: {
                        value: true, message: "Добавьте вложение"
                    },
                }]}
                urlToPost={API.subscriber.appeal.add}
                successCode={201}
                successMessage="Обращение на добавление счётчика успешно добавлено"
            >
            </Form>
            {isInfoWindowOpen && getInfoWindow()}
            {isPopupVisible &&
                <>
                    <PopUp
                        isOpen={success !== ""}
                        setIsOpen={() => setSuccess("")}
                        type="success">
                        {success}
                    </PopUp>
                    <PopUp
                        isOpen={error !== ""}
                        setIsOpen={() => setError("")}
                        type="failure" >
                        {error}
                    </PopUp>
                </>
            }
            <div className={cn({
                "flex flex-col xl:flex-row 2xl:flex-row 3xl:flex-row items-center justify-center gap-2.6 md:gap-3 mt-2 flex-col": !isDataVal
            })}>
                {!isDataVal && (
                    <span>
                        <NoDataIcon className="xl:w-[26rem] lg:w-[26rem] lg:h-[26rem] md:w-[26rem] md:h-[26rem] sm:w-[26rem] sm:h-[26rem] w-[30rem] h-[34rem] fill-[var(--primary)]" />
                    </span>
                )}
                <div className={cn({
                    "flex 3xl:flex-col 2xl:flex-col xl:flex-col md:flex-col sm:flex-col lg:flex-col 2xl:flex-row items-center justify-center": !isDataVal
                })}>
                    {!isDataVal && (
                        <Htag size="h1" className="text-center mt-[4rem] mb-[2.6rem]">
                            Данные о счётчиках ещё не добавлены
                        </Htag>
                    )}
                    <>
                        <Tabs
                            isData={isDataVal}
                            title="Приборы учёта и показания"
                            tabs={tabs}
                            tagTexts={selectedData && [selectedData?.apartmentFullAddress, "ТСЖ Прогресс"]}
                            descriptionText="Срок передачи показаний — с 20 по 25 число"
                            onAddButtonClick={() => setIsAddFormOpened(!isAddFormOpened)}
                            activeTab={apartmentId}
                            setActiveTab={setApartmentId}
                            className={`grid grid-cols-3 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-y-3.25 gap-x-4 lg:gap-y-2 md:gap-y-2 sm:gap-y-2`}
                        >
                            {selectedData?.meters && selectedData?.meters.map((meter, index) => (
                                <MeterCard meter={{ ...meter }} key={index}
                                    setSuccess={setSuccess}
                                    setError={setError}
                                    setIsInfoWindowOpen={setIsInfoWindowOpen}
                                    setSelectedMeterId={setSelectedMeterId} />
                            ))}
                        </Tabs>
                    </>
                </div>
            </div>

        </>
    );
}


function MeterCard({
    meter,
    setError,
    setSuccess,
    setSelectedMeterId, setIsInfoWindowOpen
}: MeterCardProps): JSX.Element {
    const [reading, setReading] = useState<number | string | undefined>(undefined);
    const [isReading, setIsReading] = useState<boolean>(false);
    const [inputError, setInputError] = useState<string>("");

    const iconLeft = (typeOfServiceId: number) => {
        switch (typeOfServiceId) {
            case 1:
                return <HeatingIcon />;
            case 2:
                return <WaterIcon />;
            case 3:
                return <WaterIcon />;
            case 4:
                return <ElectricityIcon />;
        }
    };

    const formatedDateMMYYYY = (date: Date) => {
        return format(new Date(date), "dd.MM.yyyy");
    };

    const formatedDateMMMMYYYY = (date: Date) => {
        return format(new Date(date), "dd MMMM yyyy", {
            locale: ru
        });
    };

    const titlePartText = (tOSName: string, uName: string) => {
        return `${tOSName}, ${uName}`;
    };

    const replaceDotWithComma = (input: number): string => {
        const inputString = String(input);
        const resultString = inputString.replace(/\./g, ',');
        return resultString;
    };

    const previousReadingsText = (previous: number, readAt: Date) => {
        if (readAt === new Date(0) || !previous) {
            return "Предыдущих показаний нет";
        } else return <>Предыдущие <strong>{replaceDotWithComma(previous)}</strong> {formatedDateMMMMYYYY(readAt)}</>;
    };

    return (
        <Card
            maxWidth="38.375rem"
            width="100%"
            titlePart={{
                text: titlePartText(meter.typeOfServiceName, meter.unitName),
                iconLeft: iconLeft(meter.typeOfServiceId),
                symbolRight: {
                    symbol: <ArrowIcon />,
                    size: "s",
                    onClick: () => {
                        setSelectedMeterId(meter.id);
                        setIsInfoWindowOpen(true);
                    }
                },
            }}
            description={
                <span>
                    {meter.factoryNumber} · Поверка <span className={cn({
                        "!text-red-500": isDaysRemainingLessThan(meter.issuedAt, 3) // ИСПРАВИТЬ
                    })}>
                        {formatedDateMMYYYY(
                            meter.issuedAt
                        )}
                    </span>
                </span>
            }
            input={{
                title: "Текущие показания",
                placeholder: meter.readings.previous ? replaceDotWithComma(meter.readings.previous) : "",
                textAlign: "center",
                readOnly: meter.readings.current ? true : false,
                button: {
                    text: "Внести показания",
                    onClick: async () => {
                        try {
                            if (reading && parseFloat(String(reading))) {

                                const response = await api.post(API.subscriber.meterReading.add, {
                                    reading: parseFloat(String(reading)),
                                    readAt: new Date(),
                                    meterId: meter.id,
                                    meterType: MeterType.Individual
                                });

                                if (response.status === 201) {
                                    setSuccess("Показания успешно внесены");
                                    setError("");
                                    setInputError("");
                                    setIsReading(true);
                                    meter.readings.current = parseFloat(String(reading));
                                } else {
                                    setError("Что-то пошло не так");
                                }
                            } else {
                                setInputError("Показание должно быть числом");
                            }
                        } catch (e: unknown) {
                            if (e instanceof AxiosError) {
                                setError(e.response?.data.message);
                            } else {
                                setError("Что-то пошло не так");
                            }
                        }
                    },
                    isReady: isReading,
                    error: inputError
                },
                inputType: "number"
            }}
            bottom={
                {
                    text: previousReadingsText(meter.readings.previous, meter.readings.previousReadAt),
                    textAlign: "center",
                }
            }
            inputValue={meter.readings.current ? replaceDotWithComma(meter.readings.current) : reading} setInputValue={setReading}
        />
    );
}

export default withLayout<MeterPageProps>(Meter);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apiUrl = API.reference.meter.get;
    const postData = {
        "meterType": MeterType.Individual,
        "isNotAllInfo": false
    };
    const { props: meterProps } = await fetchReferenceData<IGetMeterByAIDs>(context, apiUrl, postData);
    const { props: typeOfServiceProps } = await fetchReferenceData<{ typesOfService: ITypeOfService[] }>(
        context,
        API.reference.typeOfService.get,
        undefined
    );
    const { props: apartmentProps } = await fetchReferenceData<{ apartments: IGetApartment[] }>(context, API.reference.apartment.get,
        { "isAllInfo": true }
    );
    const { props: userProps } = await fetchReferenceData<{ users: IGetUserWithSubscriber[] }>(context, API.common.user.get, undefined);

    if (!meterProps || !typeOfServiceProps || !apartmentProps || !userProps) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data: {
                meters: ('meters' in meterProps.data) ? meterProps.data.meters : [],
                typesOfService: ('typesOfService' in typeOfServiceProps.data) ? typeOfServiceProps.data.typesOfService : [],
                apartments: ('apartments' in apartmentProps.data) ? apartmentProps.data.apartments : [],
                users: ('users' in userProps.data) ? userProps.data.users : []
            }
        }
    };
}

interface MeterPageProps extends Record<string, unknown>, IAppContext {
    data: {
        meters: IGetMeterByAIDs[];
        apartments: IApartmentAllInfo[];
        typesOfService: ITypeOfService[];
        users: IGetUserWithSubscriber[];
    };
}

interface MeterCardProps {
    meter: IGetMeterByAID;
    setError: Dispatch<SetStateAction<string>>;
    setSuccess: Dispatch<SetStateAction<string>>;
    setSelectedMeterId: Dispatch<SetStateAction<number>>;
    setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IGetMeterByAIDs {
    apartmentId: number;
    apartmentFullAddress: string;
    apartmentNumber: number;

    meters: IGetMeterByAID[];
}

export interface IGetMeterByAID {
    id: number;
    typeOfServiceId: number;
    typeOfServiceName: string;
    unitName: string;
    readings: {
        current: number;
        previous: number;
        previousReadAt: Date;
    }
    factoryNumber: string;
    verifiedAt: Date;
    issuedAt: Date;
}

