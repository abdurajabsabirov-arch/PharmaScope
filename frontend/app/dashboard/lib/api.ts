const API_BASE = 'http://127.0.0.1:8000';

export type DashboardData = {
  kpis: {
    total_market_value: number;
    total_units: number;
    nobel_sales?: number;
    top_company_sales?: number;
    market_share: number;
    growth: number;
    evolution_index?: number;
    cagr?: number;
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
  }>;
  top_skus?: Array<{
    sku: string;
    brand: string;
    company: string;
    sales: number;
    units?: number;
    share: number;
  }>;
  metadata: {
    filename: string | null;
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

export async function uploadIQVIAFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file');
  }

  return res.json();
}
