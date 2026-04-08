import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    var body = await request.json();
    var section = body.section || "general";
    var question = body.question || "";
    var context = body.context || "";
    var isDailyTip = body.isDailyTip || false;

    var systemPrompt = isDailyTip
      ? "Eres el consultor de IA interno de Orale Padre, una cadena de 3 restaurantes de comida mexicana en Sevilla (San Luis, Los Remedios, Sevilla Este). Trabajas con delivery (Uber Eats, Glovo) y sala. Tu trabajo es analizar los datos que te paso y dar UNA sola recomendacion concreta y accionable para hoy. Maximo 3-4 frases. Se directo, con numeros concretos. No saludes ni te presentes. Responde en espanol."
      : "Eres el consultor de IA interno de Orale Padre, una cadena de 3 restaurantes de comida mexicana en Sevilla (San Luis, Los Remedios, Sevilla Este). Trabajas con delivery (Uber Eats, Glovo) y sala. Tu trabajo es responder preguntas del admin basandote en los datos reales de la plataforma que te paso como contexto. Se concreto, usa los numeros reales, da recomendaciones accionables. Si te preguntan algo que no puedes saber con los datos disponibles, dilo. Responde en espanol. Maximo 150 palabras. No uses markdown ni asteriscos.";

    var userMessage = isDailyTip
      ? "Aqui estan los datos actuales de la plataforma:\n\n" + context + "\n\nDame la recomendacion mas importante para hoy. Algo concreto que el admin deberia revisar o cambiar basandose en estos datos. Incluye numeros."
      : "Seccion: " + section + "\n\nDatos de la plataforma:\n" + context + "\n\nPregunta del admin: " + question;

    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          { role: "user", content: userMessage }
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      var errText = await response.text();
      return NextResponse.json({ error: "API error: " + response.status, detail: errText }, { status: 500 });
    }

    var data = await response.json();
    var text = "";
    for (var i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") text += data.content[i].text;
    }

    return NextResponse.json({ response: text });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
