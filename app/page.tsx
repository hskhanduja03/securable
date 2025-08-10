"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      <iframe
        src="https://my.spline.design/web3agencysaasherosection-u0oPb4ThDmD28Z2giffVY8Y6/"
        className="w-full h-full border-none"
      ></iframe>
  
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full  backdrop-blur-md bg-white/10 text-[#2640FF] font-medium border border-[#2640FF] shadow-lg hover:bg-white/20 transition-all duration-300"
      >
        {/* <iframe src='https://my.spline.design/web3agencysaasherosection-u0oPb4ThDmD28Z2giffVY8Y6/' frameborder='0' width='100%' height='100%'></iframe> */}
        Get Started →
      </button>
    </div>
  );
}
