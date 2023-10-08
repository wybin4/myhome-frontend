import { Htag, Menu } from "@/components";
import { withLayout } from "@/layout/Layout";
import SPDIcon from "./icons/spd.svg";
import ArchiveIcon from "./icons/archive.svg";
import cn from "classnames";
import { useRouter } from "next/router";

function SPD(): JSX.Element {
    const router = useRouter();
    const baseUrl = router.asPath;

    return (
        <>
            <Htag size="h1" className="mb-[1.875rem]">Квитанции</Htag>
            <div className={cn(
                "3xl:flex 3xl:flex-cols 3xl:gap-[5.5rem] gap-[2rem] grid grid-cols-3 mb-16",
                "xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1"
            )}>
                <Menu items={[
                    {
                        title: "ЕПД", text: "Расчёт единого платёжного документа",
                        icon: <SPDIcon />,
                        href: `${baseUrl}/get-spd`
                    },
                ]} title={"Расчёт"} />
                <Menu items={[
                    {
                        title: "Архив ЕПД", text: "Просмотр ЕПД за прошлые периоды",
                        icon: <ArchiveIcon />,
                        href: `${baseUrl}/archieve-spd`
                    },
                ]} title={"Архив"} />

            </div>
        </>
    );
}

export default withLayout(SPD);