// API service for fetching data from Flask backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  filters?: Record<string, string | null>;
}

export interface DataInfo {
  totalRecords: number;
  dateRange: {
    start: string;
    end: string;
  };
  availableMonths: string[];
  tourACoverage: number;
  tourBCoverage: number;
}

export interface TourSummary {
  name: string;
  avgPower: number;
  maxPower: number;
  minPower: number;
  weekdayAvg: number;
  weekendAvg: number;
  dataCoverage: number;
  loadFactor: number;
  peakToAvgRatio: number;
  totalEnergyKwh: number;
  estimatedDailyKwh: number;
  estimatedMonthlyKwh: number;
}

export interface SummaryResponse {
  tourA: TourSummary;
  tourB: TourSummary;
  filters: Record<string, string | null>;
}

export interface HourlyData {
  hour: number;
  tourA: number;
  tourB: number;
  difference: number;
}

export interface WeeklyData {
  day: string;
  dayIndex: number;
  tourA: number;
  tourB: number;
}

export interface MonthlyData {
  month: string;
  monthName: string;
  tourA: number;
  tourB: number;
  tourAEnergy: number;
  tourBEnergy: number;
}

export interface TimeSeriesData {
  date: string;
  tourA: number;
  tourB: number;
}

export interface InsightData {
  title: string;
  value: string;
  description: string;
  icon: string;
}

export interface HeatmapPoint {
  day: string;
  dayIndex: number;
  hour: number;
  value: number;
}

// Fetch functions
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getDataInfo(): Promise<DataInfo> {
  return fetchJson<DataInfo>(`${API_BASE_URL}/data-info`);
}

export async function getSummary(params?: {
  month?: string;
  startDate?: string;
  endDate?: string;
}): Promise<SummaryResponse> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  
  const queryString = query.toString();
  return fetchJson<SummaryResponse>(`${API_BASE_URL}/summary${queryString ? '?' + queryString : ''}`);
}

export async function getHourlyData(params?: {
  month?: string;
  dayOfWeek?: number;
}): Promise<ApiResponse<HourlyData[]>> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.dayOfWeek !== undefined) query.append('day_of_week', params.dayOfWeek.toString());
  
  const queryString = query.toString();
  return fetchJson<ApiResponse<HourlyData[]>>(`${API_BASE_URL}/hourly${queryString ? '?' + queryString : ''}`);
}

export async function getWeeklyData(params?: {
  month?: string;
}): Promise<ApiResponse<WeeklyData[]>> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  
  const queryString = query.toString();
  return fetchJson<ApiResponse<WeeklyData[]>>(`${API_BASE_URL}/weekly${queryString ? '?' + queryString : ''}`);
}

export async function getMonthlyData(params?: {
  year?: string;
}): Promise<ApiResponse<MonthlyData[]>> {
  const query = new URLSearchParams();
  if (params?.year) query.append('year', params.year);
  
  const queryString = query.toString();
  return fetchJson<ApiResponse<MonthlyData[]>>(`${API_BASE_URL}/monthly${queryString ? '?' + queryString : ''}`);
}

export async function getTimeSeriesData(params?: {
  month?: string;
  startDate?: string;
  endDate?: string;
  aggregation?: 'daily' | 'hourly' | 'weekly' | 'monthly';
}): Promise<ApiResponse<TimeSeriesData[]>> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  if (params?.aggregation) query.append('aggregation', params.aggregation);
  
  const queryString = query.toString();
  return fetchJson<ApiResponse<TimeSeriesData[]>>(`${API_BASE_URL}/timeseries${queryString ? '?' + queryString : ''}`);
}

export async function getInsights(params?: {
  month?: string;
}): Promise<ApiResponse<InsightData[]>> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  
  const queryString = query.toString();
  return fetchJson<ApiResponse<InsightData[]>>(`${API_BASE_URL}/insights${queryString ? '?' + queryString : ''}`);
}

export async function getHeatmapData(params?: {
  month?: string;
}): Promise<{ tourA: HeatmapPoint[]; tourB: HeatmapPoint[]; filters: Record<string, string | null> }> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  
  const queryString = query.toString();
  return fetchJson(`${API_BASE_URL}/heatmap${queryString ? '?' + queryString : ''}`);
}

// New API types and functions for data exploration calculations

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  binCenter: number;
  count: number;
  frequency: number;
}

export interface Percentiles {
  p5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
}

export interface Quartiles {
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  lowerWhisker: number;
  upperWhisker: number;
}

export interface DistributionStatistics {
  mean: number;
  median: number;
  mode: number;
  std: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  min: number;
  max: number;
  range: number;
  count: number;
}

export interface DistributionData {
  name: string;
  histogram: HistogramBin[];
  percentiles: Percentiles;
  quartiles: Quartiles;
  statistics: DistributionStatistics;
}

export interface PeakHourData {
  hour: number;
  avgPower: number;
  timeLabel: string;
}

export interface DailyPeaksData {
  mean: number;
  median: number;
  max: number;
  min: number;
  distribution: Array<{
    binStart: number;
    binEnd: number;
    count: number;
  }>;
}

export interface PeakAnalysisData {
  name: string;
  peakHours: PeakHourData[];
  offPeakHours: PeakHourData[];
  dailyPeaks: DailyPeaksData;
}

export interface DataQualityData {
  name: string;
  totalPoints: number;
  validPoints: number;
  missingPoints: number;
  zeroPoints: number;
  nonZeroPoints: number;
  completeness: number;
  validity: number;
  hasValidReadings: boolean;
  issues: string[];
}

export interface ComparisonMetrics {
  averages: {
    tourA: number;
    tourB: number;
    difference: number;
    differencePercent: number;
    moreEfficient: string;
  };
  peaks: {
    tourA: number;
    tourB: number;
    difference: number;
    differencePercent: number;
  };
  correlation: {
    value: number;
    strength: string;
    description: string;
  };
  loadFactors: {
    tourA: number;
    tourB: number;
    winner: string;
  };
  timeComparison: {
    tourAHigherPercent: number;
    tourBHigherPercent: number;
    tourAHigherCount: number;
    tourBHigherCount: number;
  };
  hourlyComparison: {
    maxDifferenceHour: number;
    maxDifferenceValue: number;
    maxDifferenceLabel: string;
  };
  dataPoints: {
    total: number;
    commonTimePoints: number;
  };
  filters: Record<string, string | null>;
}

export async function getDistributionData(params?: {
  month?: string;
  startDate?: string;
  endDate?: string;
  bins?: number;
}): Promise<{ tourA: DistributionData; tourB: DistributionData; filters: Record<string, string | null> }> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  if (params?.bins) query.append('bins', params.bins.toString());
  
  const queryString = query.toString();
  return fetchJson(`${API_BASE_URL}/distribution${queryString ? '?' + queryString : ''}`);
}

export async function getPeakAnalysis(params?: {
  month?: string;
  startDate?: string;
  endDate?: string;
  topN?: number;
}): Promise<{ tourA: PeakAnalysisData; tourB: PeakAnalysisData; filters: Record<string, string | null> }> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  if (params?.topN) query.append('top_n', params.topN.toString());
  
  const queryString = query.toString();
  return fetchJson(`${API_BASE_URL}/peak-analysis${queryString ? '?' + queryString : ''}`);
}

export async function getDataQuality(params?: {
  month?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ tourA: DataQualityData; tourB: DataQualityData; filters: Record<string, string | null> }> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  
  const queryString = query.toString();
  return fetchJson(`${API_BASE_URL}/data-quality${queryString ? '?' + queryString : ''}`);
}

export async function getComparisonMetrics(params?: {
  month?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ComparisonMetrics> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month);
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  
  const queryString = query.toString();
  return fetchJson(`${API_BASE_URL}/comparison${queryString ? '?' + queryString : ''}`);
}
