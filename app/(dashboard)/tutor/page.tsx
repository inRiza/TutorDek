import Link from "next/link"

const page = () => {
  return (
    <div>
      <Link 
      href="/tutor/information"
      > information</Link>
      <Link 
      href="/tutor/materials"
      > materials</Link>
      <Link 
      href="/tutor/appointments"
      > appointments  </Link>
      <Link 
      href="/tutor/assignments"
      > assignments </Link>
    </div>
  )
}

export default page
