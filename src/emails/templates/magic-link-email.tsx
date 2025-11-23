import { Html } from "@react-email/html";

export default function MagicLinkEmail({ url }: { url: string }) {
  return (
    <Html>
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h2>Your login link</h2>
        <a href={url}>{url}</a>
      </div>
    </Html>
  );
}
