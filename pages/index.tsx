import { Main } from "@/components/composite/Main/Main";
import { AppContext } from "@/context/app.context";
import { withLayout } from "@/layout/Layout";
import { useContext } from "react";

function Home(): JSX.Element {
    const { userRole } = useContext(AppContext);
    return (
        <div>
            <Main userRole={userRole} />
        </div>
    );
}

export default withLayout(Home);