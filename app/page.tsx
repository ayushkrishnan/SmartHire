import { SignIn } from "@/components/custom/sign-in";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen text-black">
      <nav className="flex flex-row p-4 px-6 items-center fixed w-full backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-white">SmartHire</h2>
        <div className="ml-auto flex flex-row gap-2 items-center">
          <Link href="/resumeupload">
            <Button className="rounded-full py-2 bg-white hover:bg-neutral-200 text-black font-bold">Resume Analyzer</Button>
          </Link>
          <SignIn/>
        </div>
      </nav>
      <Image src="/tokyo.webp" width={1920} height={1080} alt="job" className="absolute h-screen w-screen object-cover rounded-md -z-10 bg-black opacity-60"/>
      <section className="flex flex-row items-center justify-center w-full h-screen p-6 text-white">
        <div className="h-full flex flex-col p-16 justify-center items-center gap-4">
          <h1 className="text-4xl font-bold">Let the jobs come to you</h1>
          <p className="max-w-96 text-center">Hire people/Be hired without fuss - Satisfaction guarunteed, and definitely!</p>
          <Button className="rounded-full py-2 w-fit bg-blue-600 hover:bg-blue-500 font-bold">Get a job</Button>
        </div>
      </section>
    </div>
  );
}
