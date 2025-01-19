import { signIn } from "@/auth"
import { Button } from "../ui/button"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <Button type="submit" className="rounded-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold">Sign In</Button>
    </form>
  )
}