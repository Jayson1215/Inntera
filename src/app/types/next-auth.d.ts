import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    hotel_id?: number;
  }

  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      hotel_id?: number;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    hotel_id?: number;
  }
}

