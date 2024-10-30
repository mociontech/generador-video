"use client";

import { useRouter } from "next/navigation";
import QRCode from 'react-qr-code';
import { useEffect, useState } from "react";

export default function OutroPage({ url }) {
  const router = useRouter();
  const [imageData, setImageData] = useState(null);

  function nextPage() {
    router.push("/");
  }

  return (
    <div
      className="w-screen h-screen flex flex-col justify-between items-center py-20 relative"
      onClick={nextPage}
    >
      <div className="outro absolute top-0 left-0 w-full h-full z-10"></div>
      {console.log(url)}
      {url ? (
        <QRCode
          value={url}
          size={550}
          className="absolute top-[27%] right-[12%] bg-blue-500 z-20"
        />
      ) : (
        <p>Cargando...</p>
      )}

      <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
        <source src="/QRoutro.mp4" type="video/mp4" />
      </video>
    </div>
  );
}