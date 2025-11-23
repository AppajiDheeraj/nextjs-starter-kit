import { Html } from "@react-email/html";

export default function RecentLoginEmail({ location }: { location: string }) {
  return (
    <Html>
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h2>New login detected</h2>
        <p>Login from: <strong>{location}</strong></p>
      </div>
    </Html>
  );
}
