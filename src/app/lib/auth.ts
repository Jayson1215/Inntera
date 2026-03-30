import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginSchema } from '@/validations';

// Demo accounts
const demoAccounts = {
  admin: {
    email: 'admin@hotel.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
  },
  manager: {
    email: 'manager@hotel.com',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User',
    hotel_id: 1,
  },
  staff: {
    email: 'staff@hotel.com',
    password: 'staff123',
    role: 'staff',
    name: 'Staff User',
    hotel_id: 1,
  },
  guest: {
    email: 'guest@example.com',
    password: 'guest123',
    role: 'guest',
    name: 'Guest User',
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        try {
          // Validate input
          const parsed = LoginSchema.safeParse(credentials);
          if (!parsed.success) {
            return null;
          }

          const { email, password } = parsed.data;

          // Check demo accounts first
          const demoAccount = Object.values(demoAccounts).find(
            (acc) => acc.email === email && acc.password === password
          ) as any;

          if (demoAccount) {
            return {
              id: email,
              email,
              name: demoAccount.name,
              role: demoAccount.role,
              hotel_id: demoAccount.hotel_id,
            };
          }

          // For production: check database
          // This is where you would query actual users and verify passwords
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.hotel_id = user.hotel_id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.hotel_id = token.hotel_id;
      }
      return session;
    },
  },
};

export const auth = NextAuth(authOptions);
export default auth;

