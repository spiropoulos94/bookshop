const { DEV } = import.meta.env;

export const BACKEND_API_URL = DEV ? "http://localhost:8080" : "";
