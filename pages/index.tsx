import { ReferenceMenu } from "@/components";
import ApartmentIcon from './apartment.svg';
import HouseIcon from './home.svg';
import SubscriberIcon from './subscriber.svg';

export default function Home(): JSX.Element {
    return (
        <div>
            <ReferenceMenu items={[
                { title: "Дома", text: "Добавление и изменение данных", icon: <HouseIcon /> },
                { title: "Жилые помещения", text: "Добавление и изменение данных", icon: <ApartmentIcon /> },
                { title: "Собственники", text: "Добавление и изменение данных", icon: <SubscriberIcon /> },
                { title: "Лицевые счета", text: "Добавление и изменение Лицевых счетов", icon: <SubscriberIcon /> },
            ]} title={"Абоненты"} />

        </div>
    );
}