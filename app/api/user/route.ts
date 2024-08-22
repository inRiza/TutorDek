import { db } from "@/lib/db"
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from 'zod';

const userSchema = z
  .object({
    fullName: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    phoneNumber: z.string().min(8, "Phone number is required")
  })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, fullName, password, phoneNumber } = userSchema.parse(body);
        
        // check if email already exist
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email}
        });
        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists"}, { status: 409 })
        }

        // check if username already exist
        const existingUserByFullname = await db.user.findUnique({
            where: { fullName: fullName}
        });
        if (existingUserByFullname) {
            return NextResponse.json({ user: null, message: "User with this name already exists"}, { status: 409 })
        }

        // hash password using bcrypt
        const hashedPassword = await hash(password, 10);

        // create new user
        const newUser = await db.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                phoneNumber,
            }
        })

        const { password: newUserPassword, ...rest } = newUser

        return NextResponse.json({ user: newUser, message: "User created successfully"}, { status: 201})
    } catch(error) {
        return NextResponse.json({message: "Something went wrong!"}, { status: 500})
    }
}