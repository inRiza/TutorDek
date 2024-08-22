import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter : PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session : {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
            password: { label: "Password", type: "password" }
          },
          // @ts-ignore
          async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                return null
            }

            const existingUser = await db.user.findUnique({
                where : { email : credentials?.email },
                include: { // Include related data
                    appointments: true,
                    assignments: {
                      include: {
                        appointment: true, // Include nested appointment data in assignments
                      },
                    },
                    notifications: true, 
                  },
                });
            if (!existingUser) {
                return null;
            }

            const passwordMatch = await compare(credentials.password, existingUser.password);

            if(!passwordMatch) {
                return null;
            }

            return {
                id : `${existingUser.id}`,
                fullName: existingUser.fullName,
                email: existingUser.email,  
                phoneNumber: existingUser.phoneNumber,
                role: existingUser.role,
                description: existingUser.description,
                jurusan: existingUser.jurusan,
                appointments: existingUser.appointments,
                assignments: existingUser.assignments,
                notifications: existingUser.notifications,
            }
          }
        })
      ],
      callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    description: user.description,
                    jurusan: user.jurusan,
                    appointments: user.appointments,
                    assignments: user.assignments,
                    materials: user.materials,
                    notifications: user.notifications,
                }
            }
            return token
        },
        async session({session, token}) {
            return {
                ...session,
                user : {
                    ...session.user,
                    id: token.id, 
                    fullName : token.fullName,
                    phoneNumber: token.phoneNumber,
                    role: token.role,
                    description: token.description,
                    jurusan: token.jurusan,
                    appointments: token.appointments,
                    assignments: token.assignments,
                    materials: token.materials,
                    notifications: token.notifications,
                }
            }
        },  
      }
}