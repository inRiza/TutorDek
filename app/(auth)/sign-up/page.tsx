import SignUpForm from "@/components/form/SignUpForm"
import Image from "next/image"
import Logo from "@/public/logo.svg"

const SignUp = () => {
  return (
    <section>
      <div className="w-full h-full flex items-center justify-center flex-col pt-32">
        <p className="font-medium text-[#4A4BC5]"> Welcome to, </p>
        <div className="flex items-center gap-2">
          <Image 
          src={Logo}
          alt="Logo"
          className="w-12"/>
          <h2 className="font-bold text-3xl"> <span className="text-[#4A4BC5]">Tutor</span> <span className="text-[#F7C738]">Dek</span> </h2>
        </div>
        <div className="w-96 mt-6">
          <SignUpForm />
        </div>
      </div>
    </section>
  )
}

export default SignUp
