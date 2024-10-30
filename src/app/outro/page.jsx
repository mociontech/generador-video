"use client";

import { useRouter } from "next/navigation";
import QRCode from 'react-qr-code';
import { useEffect, useState } from "react";

export default function OutroPage({ videoUrl }) {
  const router = useRouter();
  const [imageData, setImageData] = useState(null);

  function nextPage() {
    router.push("/");
  }

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center relative"
      onClick={nextPage}
    >
      <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
        <source src="/QRoutro.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50"></div>
      {videoUrl ? (
        <QRCode
          value={videoUrl}
          size={550}
          className="z-20"
        />
      ) : (
        <p className="z-20 text-white text-2xl">Cargando...</p>
      )}
    </div>
  );
}