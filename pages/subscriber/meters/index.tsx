import { Card, Htag, Tabs } from "@/components";
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
import { Dispatch, SetStateAction, useContext, useState } from "react";
import cn from "classnames";
import { AppContext } from "@/context/app.context";

function Meter({ data }: MeterPageProps): JSX.Element {
    const [apartmentId, setApartmentId] = useState<number>(data[0].apartmentId);
    const { isFormOpened, setIsFormOpened } = useContext(AppContext);

    return (
        <>
            <Htag size="h1" className="mb-[3rem] lg:mb-[2rem] md:mb-[2rem] sm:mb-[2rem]">Приборы учёта и показания</Htag>
            <Tabs
                tabNames={["Квартира 12", "Квартира 124"]}
                tagTexts={["Ростов-на-Дону, пер. Соборный 99, кв. 12", "ТСЖ Прогресс"]}
                descriptionText="Срок передачи показаний — с 20 по 25 число"
                onAddButtonClick={() => setIsFormOpened(!isFormOpened)}
                activeTab={apartmentId} setActiveTab={setApartmentId}
                className={cn(
                    "grid grid-cols-2 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1",
                    "gap-y-[3.25rem] lg:gap-y-[2rem] md:gap-y-[2rem] sm:gap-y-[2rem]"
                )}
            >
                {data[apartmentId].meters && data[apartmentId].meters.map((meter) =>
                    <MeterCard {...meter} key={meter.id} />
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
            key={key}
            className="w-[392px] h-[195px]"
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
    const apiUrl = API.subscriber.meters.index;

    try {
        const postData = {
            "subscriberIds": [1, 2],
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
    data: IGetMeterByAIDs[];
    role: UserRole;
    isFormOpened: boolean;
    setIsFormOpened: Dispatch<SetStateAction<boolean>>;
}

export interface IGetMeterByAIDs {
    apartmentId: number;
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