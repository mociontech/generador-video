'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OutroPage from "../outro/page";


export default function Capture() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [showConsultarStatus, setShowConsultarStatus] = useState(false);
  const [consultandoStatus, setConsultandoStatus] = useState(false);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [cargandoVideo, setCargandoVideo] = useState(false);
  const [contadorValue, setContadorValue] = useState(5);
  const [mostrarOutroPage, setMostrarOutroPage] = useState(false);

  const router = useRouter();

  const finish = () => {
    router.push("/outro");
  }

  let intervalId = null;
  let videoStream = null;
  let contador = 5;

  const iniciar = async () => {
    await abrirCamara(); // Llamar a abrirCamara aquí
    setMostrarCamara(true);
    contador = 5;
    const interval = setInterval(() => {
      contador--;
      if (contador === 0) {
        clearInterval(interval);
        tomarFoto();
      }
    }, 1000);
  };

  const tomarFoto = async () => {
    if (!videoStream) return;

    const mediaStreamTrack = videoStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(mediaStreamTrack);
    const photo = await imageCapture.takePhoto();

    setImage(photo);
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
      setMostrarBotones(true);
    };
    reader.readAsDataURL(photo);
  };

  const abrirCamara = async () => {
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.getElementById('video');
      video.srcObject = videoStream;
      video.play();
    } catch (error) {
      setError(error.message);
    }
  };

  const generar = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setVideoUrl(null);
    setCargandoVideo(true);

    try {
      const response = await fetch('/api/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
        }),
      });

      const data = await response.json();
      setUuid(data.data.uuid);
      setResponse(data);
      setShowConsultarStatus(true);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const consultarStatus = async () => {
    setConsultandoStatus(true);

    try {
      const response = await fetch(`/api/generatorstatus?uuid=${uuid}`, {
        method: 'GET',
      });

      if (response.type === 'opaqueredirect') {
        setVideoUrl(response.url);
        detenerIntervalo();
        setCargandoVideo(false);
      } else {
        const data = await response.json();

        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
          detenerIntervalo();
          setCargandoVideo(false);
        } else if (data.error) {
          setError(data.error);
          detenerIntervalo();
        }
      }
    } catch (error) {
      setError(error.message);
      detenerIntervalo();
    } finally {
      setConsultandoStatus(false);
    }
  };

  const iniciarIntervalo = () => {
    intervalId = setInterval(consultarStatus, 1000); // 1000ms = 1 segundo
  };

  const detenerIntervalo = () => {
    clearInterval(intervalId);
    intervalId = null;
  };

  useEffect(() => {
    if (showConsultarStatus && !intervalId) {
      iniciarIntervalo();
    }
  }, [showConsultarStatus, intervalId]);

  useEffect(() => {
    return () => {
      detenerIntervalo();
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (mostrarCamara && !mostrarBotones) {
      abrirCamara();
      let interval = setInterval(() => {
        setContadorValue((prevContador) => prevContador - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mostrarCamara, mostrarBotones]);

  return (
    <div
      className="selection relative flex items-center justify-center w-screen h-screen bg-blue-900"
    >
      {!mostrarOutroPage && (
        <>
          {/* Botón "Iniciar" */}
          {!mostrarCamara && (
            <button
              onClick={iniciar}
              className="font-montserrat text-[50px] font-bold w-[600px] bg-[#EB0AFF] text-white py-0 rounded-3xl h-[100px]"
            >
              Iniciar
            </button>
          )}
  
          {/* Contenedor de la cámara */}
          {mostrarCamara && (
            <div className="flex flex-col items-center space-y-4 ">
              {/* Vista de la cámara */}
              {!mostrarBotones && (
                <div>
                  <video
                    id="video"
                    autoPlay
                    muted
                    width="800"
                    height="600"
                    style={{ objectFit: "cover" }}
                  />
                  <p className="text-white text-[50px]">La foto se tomara en ... {contadorValue}</p>
                </div>
              )}
  
              {/* Imagen capturada */}
              {mostrarBotones && (
                <div className="flex flex-col items-center space-y-4">
                  <img src={imageBase64} width="800" height="600" />
                  
                  {/* Contenedor de botones en fila */}
                  <div className="flex space-x-4">
                    {/* Botón "Generar" */}
                    <button
                      onClick={generar}
                      disabled={loading || !imageBase64}
                      className="font-montserrat text-[40px] font-bold w-[300px] bg-[#EB0AFF] text-white py-0 rounded-3xl h-[80px]"
                    >
                      {loading ? "Generando..." : "Generar"}
                    </button>
                  
                    {/* Botón "Volver a tomar la foto" */}
                    <button
                      onClick={() => {
                        setMostrarBotones(false);
                        setMostrarCamara(true);
                        setContadorValue(5);
                        iniciar();
                      }}
                      className="font-montserrat text-[40px] font-bold w-[500px] bg-[#EB0AFF] text-white py-0 rounded-3xl h-[80px]"
                    >
                      Cambiar Foto
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Mensaje "Cargando video" con margen superior */}
          {cargandoVideo && <p className="text-white text-[50px] mb-20 ml-10 blink">Generando video... 1-2 minutos</p>}
  
          {/* Contenedor del video capturado con margen superior cuando también hay imagen capturada */}
          {videoUrl && (
            <div className={`flex flex-col items-center space-y-4 ${imageBase64 ? 'mb-20 ml-10' : ''}`}>
              <video loop autoPlay width="800" height="600">
                <source src={videoUrl} type="video/mp4" />
                Tu navegador no soporta el formato de video.
              </video>
              {/* Botón "Finalizar" */}
              <button
                onClick={() => setMostrarOutroPage(true)}
                className="font-montserrat text-[40px] font-bold w-[300px] bg-[#EB0AFF] text-white py-0 rounded-3xl h-[80px]"
              >
                Generar Qr
              </button>
            </div>
          )}
        </>
      )}
  
      {mostrarOutroPage && (
        <div className="absolute top-0 left-0 w-full h-full">
          <OutroPage videoUrl={videoUrl} />
        </div>
      )}
    </div>
  );
}