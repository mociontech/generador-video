'use client'

import { useState, useEffect } from "react";

export default function Home() {
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

  let intervalId = null;
  let videoStream = null;
  let contador = 5;

  const iniciar = async () => {
    setMostrarCamara(true);
    contador = 5;
    await abrirCamara(); // Llamar a abrirCamara aquí
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
      setError(error.message);
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

  return (
    <div>
      <h1>Toma una foto y generar video</h1>
      {!mostrarCamara && (
        <button onClick={iniciar}>Iniciar</button>
      )}
      {mostrarCamara && (
        <div>
          <video id="video" width="800" height="600"></video>
          {mostrarBotones ? (
            <div>
              <img src={imageBase64} width="800" height="600" />
              <button onClick={generar} disabled={loading || !imageBase64}>
                {loading ? 'Generando...' : 'Generar'}
              </button>
              <button onClick={() => {
                setMostrarBotones(false);
                setMostrarCamara(true);
                contador = 5;
                iniciar();
              }}>
                Volver a tomar la foto
              </button>
            </div>
          ) : (
            <p>Preparando cámara... {contador}</p>
          )}
        </div>
      )}
      {cargandoVideo && (
        <p>Cargando video...</p>
      )}
      {videoUrl && (
        <div>
          <video controls width="800" height="600">
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el formato de video.
          </video>
          <button onClick={() => {
            setMostrarCamara(false);
            setMostrarBotones(false);
            setCargandoVideo(false);
            setVideoUrl(null);
          }}>
            Finalizar
          </button>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
}