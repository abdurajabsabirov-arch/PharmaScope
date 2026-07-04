const API_BASE = 'http://127.0.0.1:8000';

export type DashboardData = {
  kpis: {
    total_market_value: number;
    total_units: number;
    average_price?: number;
    nobel_sales?: number;
    top_company_sales?: number;
    market_share: number;
    growth: number;
    evolution_index?: number;
    cagr?: number;
    active_companies?: number;
    market_concentration?: number;
    new_products?: number;
    active_molecules?: number;
  };
  charts: {
    sales_trend: Array<{ month: string; sales: number; units?: number }>;
    market_share: Array<{ name: string; value: number; share: number }>;
    regions?: Array<{ name: string; value: number; share: number }>;
  };
  top_brands: Array<{
    brand: string;
    company: string;
    sales: number;
    units?: number;
    share: number;
  }>;
  top_companies?: Array<{
    company: string;
    sales: number;
    units?: number;
    share: number;
    rank?: number;
  }>;
  selected_company?: {
    company: string;
    sales: number;
    units?: number;
    share: number;
    rank: number;
  } | null;
  top_skus?: Array<{
    sku: string;
    brand: string;
    company: string;
    sales: number;
    units?: number;
    share: number;
  }>;
  top_molecules?: Array<{
    molecule: string;
    sales: number;
    units?: number;
    share: number;
  }>;
  metadata: {
    filename: string | null;
    country?: string;
    rows: number;
    total_rows?: number;
    latest_period: string | null;
    selected_periods?: string[];
    message: string;
    filters?: DashboardFilters;
  };
  filter_options?: {
    company: string[];
    brand: string[];
    region: string[];
    molecule: string[];
    sku: string[];
    market: string[];
    atc1: string[];
    atc2: string[];
    atc3: string[];
    atc4: string[];
  };
  period_options?: {
    period_types: string[];
    years: string[];
    months: Array<{ value: string; label: string }>;
    quarters: string[];
    default: {
      period_type: string;
      year: string;
      selected_years: string;
      month: string;
      selected_months: string;
      quarter: string;
    };
  };
};

export type DashboardFilters = Partial<Record<
  'company' | 'brand' | 'region' | 'molecule' | 'sku' | 'market' | 'atc1' | 'atc2' | 'atc3' | 'atc4' | 'period_type' | 'year' | 'selected_years' | 'month' | 'selected_months' | 'quarter',
  string
>>;

export async function fetchDashboardData(filters: DashboardFilters = {}): Promise<DashboardData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  const res = await fetch(`${API_BASE}/dashboard/${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to load dashboard data');
  }

  return res.json();
}

export type UploadFileInfo = {
  id: string;
  filename: string;
  stored_name: string;
  country: string;
  uploaded_at?: string;
  size: number;
  active: boolean;
};

export async function uploadMarketFile(file: File, country: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('country', country);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file');
  }

  return res.json();
}

export const uploadIQVIAFile = uploadMarketFile;

export async function fetchUploads(): Promise<{ files: UploadFileInfo[] }> {
  const res = await fetch(`${API_BASE}/upload/`);
  if (!res.ok) {
    throw new Error('Failed to load uploaded files');
  }
  return res.json();
}

export async function activateUpload(fileId: string) {
  const res = await fetch(`${API_BASE}/upload/${fileId}/activate`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to activate file');
  }
  return res.json();
}

export async function deleteUpload(fileId: string) {
  const res = await fetch(`${API_BASE}/upload/${fileId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete file');
  }
  return res.json();
}

export type UserInfo = {
  id: string;
  login: string;
  role: 'admin' | 'user';
  created_at?: string;
  active: boolean;
};

export async function fetchUsers(): Promise<{ users: UserInfo[] }> {
  const res = await fetch(`${API_BASE}/users/`);
  if (!res.ok) {
    throw new Error('Failed to load users');
  }
  return res.json();
}

export async function createUser(payload: { login: string; password: string; role: 'admin' | 'user' }) {
  const res = await fetch(`${API_BASE}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create user');
  }
  return res.json();
}
