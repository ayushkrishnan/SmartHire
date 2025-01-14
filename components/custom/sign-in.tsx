import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn()
      }}
    >
      <button type="submit" className="bg-blue-600 hover:bg-blue-500 font-bold rounded-full text-white p-2 px-4">Sign in</button>
    </form>
  )
}