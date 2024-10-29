"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function nextPage() {
    router.push("/register");
  }
  
  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="welcome absolute top-0 left-0 w-full h-full z-10"></div>
      <button
        className="absolute bottom-[19%] md:w-[801px] md:h-[120px] bg-transparent z-20" 
        onClick={nextPage}
      />
      <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
        <source src="/Welcome.mp4" type="video/mp4" />
      </video>
    </main>
  );
}
