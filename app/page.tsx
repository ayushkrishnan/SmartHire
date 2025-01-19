import { SignIn } from "@/components/custom/sign-in";
import { SignOut } from "@/components/custom/sign-out";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  let dashboard = "/hr";

  if(session){
    switch(session.user.role){
      case "user":
        dashboard = "/jobs"
        break;
      case "hr":
        dashboard = "/hr"
        break;
      case "admin":
        dashboard = "/admin"
        break;
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen text-black">
      <nav className="flex flex-row p-4 px-6 items-center fixed w-full backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-white">SmartHire</h2>
        <div className="ml-auto flex flex-row gap-2 items-center">
          <Link href="/resumebuilder">
            <Button className="rounded-full py-2 bg-white hover:bg-neutral-200 text-black font-bold">Resume Builder</Button>
          </Link>
          {
            session ? 
            <>
              <Link href={dashboard}>
                <Button className="rounded-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold">Dashboard</Button>
              </Link>
              <SignOut/>
            </> 
            : 
            <SignIn/>
          }
        </div>
      </nav>
      <Image src="/tokyo.webp" width={1920} height={1080} alt="job" className="absolute h-screen w-screen object-cover rounded-md -z-10 bg-black opacity-70"/>
      <section className="flex flex-row items-center justify-center w-full h-screen p-6 text-white">
        <div className="h-full flex flex-col p-16 justify-center items-center gap-4">
          <h1 className="text-4xl font-bold">Let the jobs come to you</h1>
          <p className="max-w-96 text-center">Hire people/Be hired without fuss - Satisfaction guarunteed, and definitely!</p>
          <Link href="/jobs">
            <Button className="rounded-full py-2 w-fit bg-blue-600 hover:bg-blue-500 font-bold">Get a job</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
