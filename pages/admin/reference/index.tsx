import { Htag, Menu } from "@/components";
import { withLayout } from "@/layout/Layout";
import cn from "classnames";
import { useRouter } from "next/router";
import PenaltyIcon from "./icons/penalty.svg";
import HouseIcon from "./icons/house.svg";

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
                    { title: "Управляющие компании", text: "Добавление управляющих компаний", icon: <HouseIcon />, href: `${baseUrl}/penalty-calculation-rule` },
                    { title: "Пеня", text: "Добавление и изменение правил начисления пени", icon: <PenaltyIcon />, href: `${baseUrl}/management-company` }
                ]} />
            </div>
        </>
    );
}

export default withLayout(References);