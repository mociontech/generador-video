export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");

  const interval = 2000; // Intervalo de consulta en milisegundos
  const maxAttempts = 30; // Máximo número de intentos

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://api.aivideoapi.com/status?uuid=${uuid}`, {
      method: "GET",
      headers: {
        Authorization: "1964b41a9ae864178a50747b0ce3844da",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      const videoUrl = data.url;
      return new Response(JSON.stringify({ videoUrl }), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (data.status === "failed") {
      return new Response(JSON.stringify({ error: "Error al generar video" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  // return new Response(JSON.stringify({ error: "Tiempo máximo superado" }), {
  //   headers: { "Content-Type": "application/json" },
  // });
}
