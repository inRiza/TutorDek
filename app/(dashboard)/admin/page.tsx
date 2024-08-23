import Link from "next/link"

const page = () => {
  return (
    <div>
      admin
      <Link href="/admin/users"> users</Link>
      <Link href="/admin/tutors"> tutors</Link>
    </div>
  )
}

export default page
