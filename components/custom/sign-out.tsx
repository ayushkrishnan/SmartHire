import { signOut } from "@/auth"
import { Button } from "../ui/button"
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button type="submit" className="rounded-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold">Sign Out</Button>
    </form>
  )
}