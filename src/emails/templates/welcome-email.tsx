import { Html } from "@react-email/html";

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h2>Welcome, {name}!</h2>
        <p>Thanks for joining our platform 🚀</p>
      </div>
    </Html>
  );
}
