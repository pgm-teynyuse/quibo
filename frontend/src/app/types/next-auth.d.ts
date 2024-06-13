// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * The shape of the user object returned in the JWT and the session
   */
  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  /**
   * The shape of the JWT
   */
  interface JWT {
    id: number;
    name?: string;
    email?: string;
  }
}
