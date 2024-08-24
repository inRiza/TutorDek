import SignUpForm from "@/components/form/SignUpForm"
import Image from "next/image"
import Logo from "@/public/logo.svg"
import Background from "@/public/sign-in-bg.svg"

const SignUp = () => {
  return (
    <section>
      <div className="w-full min-h-screen h-full flex items-center justify-center flex-col bg-[#1C1C1C] relative">
        <Image 
          src={Background}
          alt="bg"
          className="w-full absolute bottom-0"
        />
        <div className="z-20 flex items-center flex-col">
          <div className="flex items-center gap-1">
            <Image 
            src={Logo}
            alt="Logo"
            className="w-9"/>
            <h2 className="font-bold text-3xl"> <span className="text-[#7879ED]">Tutor</span> <span className="text-[#F7C738]">Dek</span> </h2>
          </div>
          <div className="w-96 mt-3">
            <SignUpForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp
