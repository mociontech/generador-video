export async function POST(request) {
  const jsonData = await request.json();
  const imageBase64 = jsonData.image;

  const response = await fetch("https://api.aivideoapi.com/runway/generate/imageDescription", {
    method: "POST",
    headers: {
      Authorization: "1964b41a9ae864178a50747b0ce3844da",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text_prompt: "futuristic city behaind main character, the person is the center of the scene. ",
      img_prompt: imageBase64,
      model: "gen3",
      image_as_end_frame: false,
      flip: false,
      motion: 5,
      seed: 0,
      callback_url: "",
      time: 5,
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
}