"use client";
/* import { useMail } from "@/hooks/useMail"; */
import { useRouter } from "next/navigation";
/* import QRCode from "qrcode.react"; */
import { useEffect, useState } from "react";
/* import axios from "axios"; */ // Asegúrate de importar axios

export default function OutroPage() {
  const router = useRouter();
  /* const { mail } = useMail(); */
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    // Recupera la URL de la imagen desde localStorage
    const storedImageUrl = localStorage.getItem("generatedImageUrl");
    setImageData(storedImageUrl);
  }, []);

  function nextPage() {
    router.push("/");
  }

  /* useEffect(() => {
    const sendEmail = async () => {
      if (imageData) {
        try {
          const response = await axios.post(
            "https://devapi.evius.co/api/correos-mocion",
            {
              email: mail, // Usa el correo almacenado en el estado global
              html: `<img src="${imageData}" alt="Captura de cámara"/>`,
              subject: "sketch-pro",
              by: "mocion sketch pro",
            }
          );

          // Verifica la respuesta
          if (response.status === 200) {
            console.log("Correo enviado exitosamente:", response.data);
            // Aquí podrías mostrar un mensaje de éxito al usuario
          } else {
            console.error("Error al enviar el correo:", response.data);
            // Aquí podrías mostrar un mensaje de error al usuario
          }
        } catch (error) {
          console.error("Error al enviar el correo:", error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      }
    };

    sendEmail(); // Llama a la función para enviar el correo
  }, [imageData, mail]); // Ejecuta el efecto cuando imageData o mail cambien */

  function nextPage() {
    router.push("/");
  }

  return (
    <div
      className="w-screen h-screen flex flex-col justify-between items-center py-20 relative"
      onClick={nextPage}
    >
      <div className="outro absolute top-0 left-0 w-full h-full z-10"></div>
      {/* QR generado por fabian */}
      {/* {imageData ? (
        <QRCode
          value={imageData}
          size={550}
          className="absolute top-[27%] right-[12%] bg-blue-500 z-20"
        />
      ) : (
        <p>Cargando...</p>
      )} */}

      <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
        <source src="/QRoutro.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
