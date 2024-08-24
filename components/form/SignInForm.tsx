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
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useToast } from '../ui/use-toast';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

const SignInForm = () => {
  const { data: session } = useSession()
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email : values.email,
      password : values.password,
      redirect: false,
    });
    if(signInData?.error) {
      toast({
        title:"Sign In Failed",
        description: "Your email or password is wrong!",
        variant:"destructive",
      })
    } else {
      // Redirect based on user role from session
      const role = session?.user?.role;
  
      if (role === 'Mahasiswa') {
        router.push('/');
      } else if (role === 'Admin') {
        router.push('/admin/users');
      } else if (role === 'Tutor') {
        router.push('/tutor/appointments');
      } else {
        router.push('/'); // Default redirect if role is undefined or unexpected
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full bg-[#292929] p-5 rounded-xl'>
        <h3 className='text-center text-white font-semibold text-2xl'> Sign In </h3>
        <p className='text-[#A1A1A1] text-center'> To study with us! </p>
        <div className='space-y-2 mt-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white font-semibold'>Email address</FormLabel>
                <FormControl className='text-white'>
                  <Input className="bg-[#292929] border-[1px] border-[#A1A1A1]" placeholder='mail@example.com' {...field} />
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
                    className='bg-[#292929] border-[1px] border-[#A1A1A1] focus:outline-none text-white '
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6 rounded-lg bg-[#7879ED] font-semibold' type='submit'>
          Sign in
        </Button>
        <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-[#A1A1A1] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#A1A1A1] text-[#A1A1A1]'>
          or
        </div>
        <p className='text-center text-sm text-[#A1A1A1] mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-[#7879ED] hover:underline ml-1' href='/sign-up'>
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;
