'use client'

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
const UserAccountButton = () => {
  return (
    <div>
        <Button onClick={() => signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/sign-in`
            })} variant="destructive">
                Sign Out
            </Button>
    </div>
  )
}

export default UserAccountButton
