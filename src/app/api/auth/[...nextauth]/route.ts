import { handlers, auth } from "@/lib/auth";

export const { GET, POST } = handlers;

// Export auth for middleware usage
export { auth };
