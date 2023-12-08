import { Card, Form, Htag, Tabs } from "@/components";
import { withLayout } from "@/layout/Layout";
import HeatingIcon from "./icons/heating.svg";
import WaterIcon from "./icons/water.svg";
import ElectricityIcon from "./icons/electricity.svg";
import ArrowIcon from "./icons/arrow.svg";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";
import { API } from "@/helpers/api";
import { useState } from "react";
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

function Meter({ data }: MeterPageProps): JSX.Element {
    const [apartmentId, setApartmentId] = useState<number>(data.meters[0].apartmentId);
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);
    const [selectedSubscriberId, setSelectedSubscriberId] = useState<number>(0);
    const [selectedMCId, setSelectedMCId] = useState<number>(0);
    const useFormData = useForm<IAppeal>();

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
        if (data.apartments) {
            const apartment = data.apartments.find(a => a.id === apartmentId);
            if (apartment) {
                const subscriberId = apartment.subscriberId;
                if (data.users) {
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

    return (
        <>
            <Form
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
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
                successMessage="Обращение на добавление счётчика успешно добавлено"            >
            </Form>
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
                            onAddButtonClick={() => setIsFormOpened(!isFormOpened)}
                            activeTab={apartmentId}
                            setActiveTab={setApartmentId}
                            className={`grid grid-cols-3 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-y-3.25 gap-x-4 lg:gap-y-2 md:gap-y-2 sm:gap-y-2`}
                        >
                            {selectedData?.meters && selectedData?.meters.map((meter, index) => (
                                <MeterCard {...meter} key={index} />
                            ))}
                        </Tabs>
                    </>
                </div>
            </div>

        </>
    );
}


function MeterCard(meter: IGetMeterByAID, key: number): JSX.Element {
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
            key={key}
            titlePart={{
                text: titlePartText(meter.typeOfServiceName, meter.unitName),
                iconLeft: iconLeft(meter.typeOfServiceId),
                symbolRight: {
                    symbol: <ArrowIcon />,
                    size: "s",
                    onClick: () => { }
                },
            }}
            description={`${meter.factoryNumber} · Поверка ${formatedDateMMYYYY(meter.verifiedAt)}`}
            input={{
                title: "Текущие показания",
                placeholder: meter.readings.previous ? replaceDotWithComma(meter.readings.previous) : "",
                textAlign: "center",
                value: meter.readings.current ? replaceDotWithComma(meter.readings.current) : "",
                readOnly: meter.readings.current ? true : false,
            }}
            bottom={
                {
                    text: previousReadingsText(meter.readings.previous, meter.readings.previousReadAt),
                    textAlign: "center"
                }
            }
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

