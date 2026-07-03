const API_BASE = 'http://localhost:8000';

export async function fetchDashboardData() {
  const res = await fetch(`${API_BASE}/dashboard`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function uploadIQVIAFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}