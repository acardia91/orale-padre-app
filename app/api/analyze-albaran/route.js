// /app/api/analyze-albaran/route.js
// Vercel serverless function — proxy to Claude API for albaran analysis

export async function POST(request) {
  try {
    const { image, mediaType } = await request.json();

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const systemPrompt = `Eres un asistente experto en leer albaranes de proveedores de restaurantes en España.
Extrae TODOS los productos/líneas del albarán con su cantidad, unidad de medida, precio unitario y precio total de línea.
También extrae: nombre del proveedor, fecha del albarán, y total general.
Responde SOLO con JSON válido, sin markdown ni backticks. Formato exacto:
{"proveedor":"nombre","fecha":"DD/MM/YYYY","total":123.45,"lineas":[{"producto":"nombre","cantidad":1,"unidad":"kg","precioUnit":1.50,"totalLinea":1.50}]}
Si no puedes leer algo claramente, pon tu mejor estimación y añade un campo "duda":true en esa línea.
Unidades comunes: kg, ud, L, caja, bolsa, paquete, lata, bote, bandeja.
Si ves IVA, extrae los precios SIN IVA (base imponible).`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } },
            { type: "text", text: "Lee este albarán de proveedor de restaurante y extrae todos los datos en JSON." }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Claude API error ${response.status}: ${errText.substring(0, 300)}` }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract text from response
    let text = "";
    for (const block of (data.content || [])) {
      if (block.type === "text") text += block.text;
    }

    // Parse JSON
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);

    return Response.json(parsed);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
