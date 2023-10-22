import { Card, Form, Tabs } from "@/components";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import HeatingIcon from "./icons/heating.svg";
import WaterIcon from "./icons/water.svg";
import ElectricityIcon from "./icons/electricity.svg";
import ArrowIcon from "./icons/arrow.svg";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";
import { UserRole } from "@/interfaces/account/user.interface";
import { API } from "@/helpers/api";
import { useState } from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { ISubscriberAddMeterForm } from "@/interfaces/reference/meter.interface";

function Meter({ data }: MeterPageProps): JSX.Element {
    const [apartmentId, setApartmentId] = useState<number>(data.meters[0].apartmentId);
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);
    const useFormData = useForm<ISubscriberAddMeterForm>();

    const tabs = data.meters.map(obj => {
        return {
            name: "Квартира " + obj.apartmentNumber,
            id: obj.apartmentNumber
        };
    });

    // ИСПРАВИТЬ MOCK-DATA 

    const selectedData = data.meters.find(obj => obj.apartmentId === apartmentId);

    return (
        <>
            <Form
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title="Добавление счётчика"
                selectors={[
                    {
                        size: "m", inputTitle: "Тип услуги", id: "typeOfService",
                        options: [
                            { value: 1, text: "Газ" },
                            { value: 2, text: "Электричество" },
                            { value: 3, text: "ХВС" },
                        ],
                        numberInOrder: 1, type: "select",
                        error: { value: true, message: "Заполните тип услуги" }
                    }
                ]}
                datePickers={[
                    {
                        id: "verificationDate", type: "datepicker", inputTitle: "Дата поверки", inputSize: "m", numberInOrder: 2,
                        error: { value: true, message: "Заполните дату поверки" }
                    },
                    {
                        id: "dateOfPreviousReading", type: "datepicker", inputTitle: "Дата предыдущего показания", inputSize: "m", numberInOrder: 3,
                        error: { value: true, message: "Заполните дату предыдущего показания" }
                    },
                ]}
                inputs={[
                    {
                        id: "previousReading", type: "input", size: "m", title: "Предыдущее показание", numberInOrder: 4,
                        error: { value: true, message: "Заполните предыдущее показание" }
                    }
                ]} urlToPost={""} successCode={200} successMessage={""}            >
            </Form>
            <Tabs
                title="Приборы учёта и показания"
                tabs={tabs}
                tagTexts={selectedData && [selectedData?.apartmentFullAddress, "ТСЖ Прогресс"]}
                descriptionText="Срок передачи показаний — с 20 по 25 число"
                onAddButtonClick={() => setIsFormOpened(!isFormOpened)}
                activeTab={apartmentId} setActiveTab={setApartmentId}
                className={cn(
                    "grid grid-cols-3 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1",
                    "gap-y-[3.25rem] gap-x-4 lg:gap-y-[2rem] md:gap-y-[2rem] sm:gap-y-[2rem]"
                )}
            >
                {selectedData?.meters && selectedData?.meters.map((meter, index) =>
                    <MeterCard {...meter} key={index} />
                )}
            </Tabs>
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
            maxWidth="26rem"
            key={key}
            titlePart={{
                text: titlePartText(meter.typeOfServiceName, meter.unitName),
                iconLeft: iconLeft(meter.typeOfServiceId),
                symbolRight: <ArrowIcon />,
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

export async function getServerSideProps() {
    const apiUrl = API.subscriber.meter.index;

    try {
        const postData = {
            "subscriberIds": [1, 2], // ИСПРАВИТЬ!!!
        };
        const { data } = await axios.post<{ data: IGetMeterByAIDs[] }>(apiUrl, postData);
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
    } catch {
        return {
            notFound: true
        };
    }
}

interface MeterPageProps extends Record<string, unknown> {
    data: { meters: IGetMeterByAIDs[] };
    role: UserRole;
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

