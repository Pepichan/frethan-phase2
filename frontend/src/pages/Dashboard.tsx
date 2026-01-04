export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Logged in as: <strong>{role}</strong></p>
    </div>
  );
}
