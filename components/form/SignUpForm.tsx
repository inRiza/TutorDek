'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, useToast } from '../ui/use-toast';

const FormSchema = z
  .object({
    fullName: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    phoneNumber: z.string().min(8, "Phone number is required")
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('api/user', {
      method : "POST",
      headers: {
        'Content-Type' : "application/json"
      },
      body: JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber
      })
    })

    if (response.ok) {
      router.push('/')
    } else {
      toast({
        title:"Sign Up Failed",
        description: "Your name or email already exist!",
        variant:"destructive",
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full bg-[#292929] p-5 rounded-xl'>
        <h3 className='text-center text-white font-semibold text-2xl'> Sign Up </h3>
        <p className='text-[#A1A1A1] text-center'> Create your account! </p>
        <div className='space-y-2 mt-5'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white font-semibold'>Fullname</FormLabel>
                <FormControl>
                  <Input className="bg-[#292929] border-[1px] border-[#A1A1A1] text-white" placeholder='Enter your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white font-semibold'>Email</FormLabel>
                <FormControl>
                  <Input className="bg-[#292929] border-[1px] border-[#A1A1A1] text-white" placeholder='mail@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white font-semibold'>Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#292929] border-[1px] border-[#A1A1A1] text-white"
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white font-semibold'>Re-Enter your password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#292929] border-[1px] border-[#A1A1A1] text-white"
                    placeholder='Re-Enter your password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white font-semibold'>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#292929] border-[1px] border-[#A1A1A1] text-white"
                    placeholder='08xxxxxxxxxx'
                    type='tel'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6 rounded-lg bg-[#7879ED] font-semibold' type='submit'>
          Sign up
        </Button>
        <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-[#A1A1A1] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#A1A1A1] text-[#A1A1A1]'>
        or
        </div>
        <p className='text-center text-sm text-[#A1A1A1] mt-2'>
          If you have an account, please&nbsp;
          <Link className='text-[#7879ED] hover:underline ml-1' href='/sign-in'>
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
