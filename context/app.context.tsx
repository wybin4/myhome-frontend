import { UserRole } from "@/interfaces/account/user.interface";
import { createContext, PropsWithChildren, useState } from "react";

export interface IAppContext {
	role: UserRole;
	setRole?: (newRole: UserRole) => void;
}
export const AppContext = createContext<IAppContext>({ role: "none" });

export const AppContextProvider = ({ role, children }: PropsWithChildren<IAppContext>): JSX.Element => {
	const [roleState, setRoleState] = useState<UserRole>(role);

	const setRole = (newRole: UserRole) => {

		setRoleState(newRole);
	};

	return <AppContext.Provider value={{ role: roleState, setRole }}>
		{children}
	</AppContext.Provider>;
};