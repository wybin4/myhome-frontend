import { UserRoleType } from "@/interfaces/account/user.interface";
import { createContext, PropsWithChildren, useState } from "react";

export interface IAppContext {
	role: UserRoleType;
	setRole?: (newRole: UserRoleType) => void;
}
export const AppContext = createContext<IAppContext>({
	role: "none"
});

export const AppContextProvider = ({ role, children }: PropsWithChildren<IAppContext>): JSX.Element => {
	const [roleState, setRoleState] = useState<UserRoleType>(role);

	const setRole = (newRole: UserRoleType) => {
		setRoleState(newRole);
	};

	return <AppContext.Provider value={{
		role: roleState, setRole
	}}>
		{children}
	</AppContext.Provider>;
};