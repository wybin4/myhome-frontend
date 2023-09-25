import { UserRole } from "@/interfaces/account/user.interface";
import { createContext, PropsWithChildren, useState } from "react";

export interface IAppContext {
	role: UserRole;
	setRole?: (newRole: UserRole) => void;
	isFormOpened: boolean;
	setIsFormOpened: (newFormOpened: boolean) => void;
}
export const AppContext = createContext<IAppContext>({
	role: "none",
	isFormOpened: false,
	setIsFormOpened: () => console.log("Метод setIsFormOpened не установлен")
});

export const AppContextProvider = ({ role, children }: PropsWithChildren<IAppContext>): JSX.Element => {
	const [roleState, setRoleState] = useState<UserRole>(role);
	const [isFormOpened, setIsFormOpened] = useState<boolean>(false);

	const setRole = (newRole: UserRole) => {
		setRoleState(newRole);
	};

	const setFormOpened = (newFormOpened: boolean) => {
		setIsFormOpened(newFormOpened);
	};

	return <AppContext.Provider value={{
		role: roleState, setRole,
		isFormOpened, setIsFormOpened: setFormOpened
	}}>
		{children}
	</AppContext.Provider>;
};