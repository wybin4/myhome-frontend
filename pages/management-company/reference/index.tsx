import { Htag, Menu } from "@/components";
import { withLayout } from "@/layout/Layout";
import HouseIcon from "./icons/house.svg";
import ApartmentIcon from "./icons/apartment.svg";
import SubscriberIcon from "./icons/subscriber.svg";
import MeterIcon from "./icons/meter.svg";
import CommonHouseNeedIcon from "./icons/common-house-needs.svg";
import TariffAndNormIcon from "./icons/tariffs&norms.svg";
import SocialNormIcon from "./icons/social-norm.svg";
import SeasonalityFactorIcon from "./icons/seasonality-factor.svg";
import cn from "classnames";
import { useRouter } from "next/router";

function References(): JSX.Element {
    const router = useRouter();
    const baseUrl = router.asPath;

    return (
        <>
            <Htag size="h1" className="mb-[1.875rem]">Справочники</Htag>
            <div className={cn(
                "3xl:flex 3xl:flex-cols 3xl:gap-[5.5rem] gap-[2rem] grid grid-cols-3 mb-16",
                "xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1"
            )}>
                <Menu items={[
                    { title: "Дома", text: "Добавление и изменение данных", icon: <HouseIcon />, href: `${baseUrl}/house` },
                    { title: "Жилые помещения", text: "Добавление и изменение данных", icon: <ApartmentIcon />, href: `${baseUrl}/apartment` },
                    { title: "Собственники", text: "Добавление и изменение данных", icon: <SubscriberIcon />, href: `${baseUrl}/owner` },
                    { title: "Лицевые счета", text: "Добавление и изменение лицевых счетов", icon: <SubscriberIcon />, href: `${baseUrl}/subscriber` },
                ]} title={"Абоненты"} />
                <Menu items={[
                    { title: "ИПУ", text: "Добавление и изменение данных", icon: <MeterIcon />, href: `${baseUrl}/individual-meter` },
                    { title: "ОПУ", text: "Добавление и изменение данных", icon: <MeterIcon />, href: `${baseUrl}/general-meter` },
                ]} title={"Приборы учёта"} />
                <Menu items={[
                    { title: "Общедомовые нужды", text: "Добавление и изменение тарифов на общедомовые нужды", icon: <CommonHouseNeedIcon />, href: `${baseUrl}/common-house-need-tariff` },
                    { title: "Муниципальные тарифы", text: "Добавление и изменение данных", icon: <TariffAndNormIcon />, href: `${baseUrl}/municipal-tariff` },
                    { title: "Нормативы", text: "Добавление и изменение данных", icon: <TariffAndNormIcon />, href: `${baseUrl}/norm` },
                    { title: "Социальная норма", text: "Добавление и изменение данных", icon: <SocialNormIcon />, href: `${baseUrl}/social-norm` },
                    { title: "Коэффициент сезонности", text: "Добавление и изменение данных", icon: <SeasonalityFactorIcon />, href: `${baseUrl}/seasonality-factor` },
                ]} title={"Тарифы и нормативы"} />
                <Menu items={[
                    { title: "Пеня", text: "Добавление и изменение правил расчёта пени", icon: <CommonHouseNeedIcon />, href: `${baseUrl}/penalty-rule` },
                ]} title={"Правила"} />
            </div>
        </>
    );
}

export default withLayout(References);