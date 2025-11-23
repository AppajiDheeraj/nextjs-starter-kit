import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { EmailTemplates } from "@/emails";
import { transporter } from "@/server/mail/transporter";

export async function POST(req: Request) {
  try {
    const { to, url } = await req.json();

    if (!to || !url) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const html = await render(EmailTemplates.MagicLinkEmail({ url }));

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Magic Login Link",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
