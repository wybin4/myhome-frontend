import { getUserCookie } from "@/helpers/constants";
import { UserRole } from "@/interfaces/account/user.interface";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

export interface IAppContext {
	userRole: UserRole;
	setUserRole?: (newRole: UserRole) => void;
	userId: number;
	setUserId?: (newId: number) => void;
}

export const AppContext = createContext<IAppContext>({
	userRole: UserRole.None,
	userId: 0
});

export const AppContextProvider = ({ userId, userRole, children }: PropsWithChildren<IAppContext>): JSX.Element => {
	const [userIdState, setUserIdState] = useState<number>(userId);
	const [roleState, setRoleState] = useState<UserRole>(userRole);

	const setUserRole = (newRole: UserRole) => {
		setRoleState(newRole);
	};

	const setUserId = (newId: number) => {
		setUserIdState(newId);
	};

	useEffect(() => {
		getUserCookie(setUserRole, setUserId);
	}, []);

	return <AppContext.Provider value={{
		userRole: roleState, setUserRole,
		userId: userIdState, setUserId
	}}>
		{children}
	</AppContext.Provider>;
};