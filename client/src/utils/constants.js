export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;

export const SIGNIN_ROUTE = `${AUTH_ROUTES}/signin`;

export const USER_INFO_ROUTE = `${AUTH_ROUTES}/userInfo`;

export const SAVE_CHANGES = `${AUTH_ROUTES}/saveChanges`;

export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logOut`;

export const CONTACT_ROUTES = "api/contacts";

export const SEARCH_CONTACT = `${CONTACT_ROUTES}/search`;
