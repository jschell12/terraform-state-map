export async function uploadTfState(file: File, api = import.meta.env.VITE_API_URL || "http://localhost:8080") {
  const formData = new FormData();
  formData.append("state", file);
  const res = await fetch('/api/graph', { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json(); // { nodes, edges, compounds }
}