import { FileForm } from "@/components";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";

function Home(): JSX.Element {
    const matchHeaders = [{
        name: "name",
        value: "Название"
    }, {
        name: "email",
        value: "Email"
    }];
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);

    return (
        <div>

            <FileForm
                headers={matchHeaders}
                title="Добавление управляющих компаний"
                isOpened={isFormOpened}
                setIsOpened={setIsFormOpened}
                urlToPost={API.common.user.addMany}
                successCode={200}
                successMessage="Управляющие компании успешно добавлены"
                entityName="user"
                additionalFormData={{ userRole: UserRole.ManagementCompany }}
            />

            <button onClick={() => setIsFormOpened(true)}>Нажми</button>
        </div>
    );
}

export default withLayout(Home);