import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    var body = await request.json();
    var taskTitle = body.taskTitle || "";
    var projectName = body.projectName || "";
    var assignedTo = body.assignedTo || [];
    var priority = body.priority || "media";
    var deadline = body.deadline || "";
    var createdBy = body.createdBy || "";
    var comment = body.comment || "";

    var apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    // Email mapping — update with real emails
    var EMAILS = {
      "Lale": "alejandrogomez@oralepadre.com",
      "Carrick": "alexcarrasco@oralepadre.com",
      "Rafa": "rafaelleon@oralepadre.com",
      "Coti": "miguelmatamoros@oralepadre.com",
    };

    var recipients = [];
    for (var i = 0; i < assignedTo.length; i++) {
      if (EMAILS[assignedTo[i]]) recipients.push(EMAILS[assignedTo[i]]);
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No valid recipients" }, { status: 400 });
    }

    var priLabels = { alta: "🔴 ALTA", media: "🟡 MEDIA", baja: "🟢 BAJA" };
    var priLabel = priLabels[priority] || priority;

    var subject = comment
      ? "💬 Nuevo comentario en: " + taskTitle + " — " + projectName
      : "📋 Nueva tarea: " + taskTitle + " — " + projectName;

    var html = comment
      ? "<div style='font-family:system-ui;max-width:500px;margin:0 auto'>"
        + "<div style='background:#1a1a1a;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0'>"
        + "<div style='font-size:18px;font-weight:800'>💬 Nuevo comentario</div>"
        + "<div style='font-size:13px;color:#888;margin-top:4px'>" + projectName + "</div></div>"
        + "<div style='background:#fff;padding:20px;border:1px solid #eee;border-radius:0 0 12px 12px'>"
        + "<div style='font-size:16px;font-weight:700;margin-bottom:8px'>" + taskTitle + "</div>"
        + "<div style='background:#f8f8f8;padding:12px 16px;border-radius:8px;border-left:3px solid #B45309;margin-bottom:12px'>"
        + "<div style='font-size:12px;color:#888;margin-bottom:4px'>" + createdBy + ":</div>"
        + "<div style='font-size:14px;color:#333'>" + comment + "</div></div>"
        + "<a href='https://app.oralepadre.com' style='display:inline-block;padding:10px 24px;background:#1a1a1a;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px'>Abrir proyecto →</a>"
        + "</div></div>"
      : "<div style='font-family:system-ui;max-width:500px;margin:0 auto'>"
        + "<div style='background:#1a1a1a;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0'>"
        + "<div style='font-size:18px;font-weight:800'>📋 Tarea asignada</div>"
        + "<div style='font-size:13px;color:#888;margin-top:4px'>" + projectName + "</div></div>"
        + "<div style='background:#fff;padding:20px;border:1px solid #eee;border-radius:0 0 12px 12px'>"
        + "<div style='font-size:20px;font-weight:800;margin-bottom:8px'>" + taskTitle + "</div>"
        + "<div style='display:flex;gap:8px;margin-bottom:12px'>"
        + "<span style='padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;background:#f5f5f5'>" + priLabel + "</span>"
        + (deadline ? "<span style='padding:4px 12px;border-radius:6px;font-size:12px;background:#f5f5f5'>📅 " + deadline + "</span>" : "")
        + "</div>"
        + "<div style='font-size:13px;color:#888;margin-bottom:16px'>Asignada por <strong>" + createdBy + "</strong> a <strong>" + assignedTo.join(", ") + "</strong></div>"
        + "<a href='https://app.oralepadre.com' style='display:inline-block;padding:10px 24px;background:#1a1a1a;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px'>Abrir proyecto →</a>"
        + "</div></div>";

    var response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        from: "Orale Padre <notificaciones@oralepadre.com>",
        to: recipients,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      var errText = await response.text();
      return NextResponse.json({ error: "Resend error: " + response.status, detail: errText }, { status: 500 });
    }

    var data = await response.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
