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
    active_brands?: number;
    active_skus?: number;
  };
  charts: {
    sales_trend: Array<{ month: string; sales: number; units?: number }>;
    long_term_trend?: Array<{ year: string; sales: number; units?: number }>;
    market_share: Array<{ name: string; value: number; share: number }>;
    regions?: Array<{ name: string; value: number; share: number }>;
  };
  top_brands: Array<{
    brand: string;
    company: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
  }>;
  top_companies?: Array<{
    company: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
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
    sales_change?: number;
    share_change?: number;
  }>;
  top_molecules?: Array<{
    molecule: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
  }>;
  top_atc4?: Array<{
    atc4: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
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
    form: string[];
    group: string[];
    segment: string[];
    channel: string[];
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
  'company' | 'brand' | 'region' | 'molecule' | 'sku' | 'market' | 'form' | 'group' | 'segment' | 'channel' | 'atc1' | 'atc2' | 'atc3' | 'atc4' | 'period_type' | 'year' | 'selected_years' | 'month' | 'selected_months' | 'quarter',
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

export type PerformanceFilters = Partial<Record<
  'year' | 'quarter' | 'month' | 'group' | 'region' | 'city' | 'supervisor' | 'field_force_manager' | 'marketing_manager' | 'product_manager' | 'brand' | 'sku' | 'type' | 'rx_otc' | 'tylolfen' | 'country',
  string
>>;

export type PerformanceRow = {
  brand?: string;
  sku?: string;
  region?: string;
  supervisor?: string;
  group?: string;
  field_force_manager?: string;
  marketing_manager?: string;
  product_manager?: string;
  quti_plan: number;
  quti_fact: number;
  uzs_plan: number;
  uzs_fact: number;
  achievement_quti: number;
  achievement_uzs: number;
  quti_ppg: number;
  uzs_ppg: number;
  share_quti: number;
  share_uzs: number;
  status: string;
};

export type PerformanceCockpitData = {
  kpis: {
    quti_plan: number;
    quti_fact: number;
    uzs_plan: number;
    uzs_fact: number;
    achievement_quti: number;
    achievement_uzs: number;
    ppg_quti: number;
    ppg_uzs: number;
    share_quti: number;
    share_uzs: number;
    quti_change: number;
    uzs_change: number;
  };
  pulse: {
    summary?: string;
    overall_status?: string;
    best_brand?: PerformanceRow | null;
    weak_brand?: PerformanceRow | null;
    best_region?: PerformanceRow | null;
    weak_region?: PerformanceRow | null;
    best_group?: PerformanceRow | null;
    weak_group?: PerformanceRow | null;
    best_product_manager?: PerformanceRow | null;
  };
  charts: {
    performance_trend: Array<{ month: string; quti_fact: number; uzs_fact: number; quti_ppg: number; uzs_ppg: number }>;
    quti_growth: Array<{ month: string; value: number }>;
    uzs_growth: Array<{ month: string; value: number }>;
  };
  tables: {
    brands: PerformanceRow[];
    skus: PerformanceRow[];
    regions: PerformanceRow[];
    groups: PerformanceRow[];
    marketing_managers: PerformanceRow[];
    field_force_managers: PerformanceRow[];
    product_managers: PerformanceRow[];
  };
  filter_options: Record<string, string[]>;
  period_options: {
    years: string[];
    months: Array<{ value: string; label: string }>;
    quarters: string[];
    default: { year?: string; month?: string; quarter?: string };
  };
  metadata: {
    filename: string | null;
    country?: string;
    rows: number;
    latest_period?: string;
    selected_rows?: number;
    message: string;
  };
};

export async function fetchPerformanceCockpitData(filters: PerformanceFilters = {}): Promise<PerformanceCockpitData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  const res = await fetch(`${API_BASE}/performance-cockpit/${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to load Performance Cockpit data');
  }

  return res.json();
}

export type UploadFileInfo = {
  id: string;
  filename: string;
  stored_name: string;
  country: string;
  destination?: 'market_intelligence' | 'performance_cockpit';
  source?: 'iqvia' | 'performance' | 'secondary_sales';
  uploaded_at?: string;
  size: number;
  active: boolean;
};

export type UploadDestination = 'market_intelligence' | 'performance_cockpit';
export type UploadSource = 'iqvia' | 'performance' | 'secondary_sales';

export type UploadSummary = {
  destination: UploadDestination;
  source: UploadSource;
  file_name: string;
  rows: number;
  columns: number;
  detected_periods: string[];
  status: string;
};

export async function uploadMarketFile(
  file: File,
  country: string,
  destination: UploadDestination = 'market_intelligence',
  source: UploadSource = 'iqvia',
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('country', country);
  formData.append('destination', destination);
  formData.append('source', source);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    let detail = 'Failed to upload file';
    try {
      const payload = await res.json();
      detail = payload.detail ?? payload.message ?? detail;
    } catch {
      detail = (await res.text()) || detail;
    }
    throw new Error(detail);
  }

  return res.json() as Promise<{
    status: string;
    filename: string;
    message?: string;
    file: UploadFileInfo;
    dashboard?: DashboardData | null;
    summary?: UploadSummary;
  }>;
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
  full_name?: string;
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

export async function createUser(payload: { login: string; password: string; role: 'admin' | 'user'; full_name?: string }) {
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

export async function loginUser(payload: { login: string; password: string }) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Invalid login or password');
  }
  return res.json() as Promise<{ status: string; user: UserInfo }>;
}
