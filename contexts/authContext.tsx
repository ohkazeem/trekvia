import { createContext, useReducer } from "react";

export type UserProps = {
	id: string;
	username: string;
	email: string;
};

export type LoginDataProps = {
	username: string;
	password: string;
};

export type SignupDataProps = {
	username: string;
	email: string;
	password: string;
};

type AuthStateProps = {
	user: UserProps | null;
	loading: boolean;
	error: string | null;
};

type AuthActionProps =
	| {
			type: "AUTH_START";
	  }
	| { type: "AUTH_SUCCESS"; payload: UserProps }
	| { type: "AUTH_FAILURE"; payload: string }
	| { type: "LOGOUT" };

const initialState: AuthStateProps = {
	user: null,
	loading: true,
	error: null,
};

function reducer(state: AuthStateProps, action: AuthActionProps) {
	switch (action.type) {
		case "AUTH_START":
			return { ...state, loading: true, error: null };
		case "AUTH_SUCCESS":
			return { user: action.payload, loading: false, error: null };
		case "AUTH_FAILURE":
			return { ...state, loading: false, error: action.payload };
		case "LOGOUT":
			return initialState;
		default:
			return state;
	}
}

type AuthContextProps = AuthStateProps & {
	login(data: LoginDataProps): Promise<void>;
	signup(data: SignupDataProps): Promise<void>;
	logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const login = async (data: LoginDataProps) => {
	console.log("login");
};

const signup = async (data: SignupDataProps) => {
	console.log("signup");
};

const logout = async () => {
	console.log("logout");
};

// Context Provider
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return <AuthContext.Provider value={{ ...state, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
