import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getDataInfo,
  getSummary,
  getHourlyData,
  getWeeklyData,
  getMonthlyData,
  getTimeSeriesData,
  getInsights,
  DataInfo,
  TourSummary,
  HourlyData,
  WeeklyData,
  MonthlyData,
  TimeSeriesData,
  InsightData,
} from '../services/api';

interface FilterState {
  month: string | null;
  startDate: string | null;
  endDate: string | null;
  aggregation: 'daily' | 'hourly' | 'weekly';
  dayOfWeek: number | null;
  year: string | null;
}

interface DataState {
  dataInfo: DataInfo | null;
  tourA: TourSummary | null;
  tourB: TourSummary | null;
  hourlyData: HourlyData[];
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  timeSeriesData: TimeSeriesData[];
  insights: InsightData[];
  loading: boolean;
  error: string | null;
}

interface DataContextType extends DataState {
  filters: FilterState;
  setMonth: (month: string | null) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  setAggregation: (agg: 'daily' | 'hourly' | 'weekly') => void;
  setDayOfWeek: (day: number | null) => void;
  setYear: (year: string | null) => void;
  refreshData: () => void;
  clearFilters: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    month: null,
    startDate: null,
    endDate: null,
    aggregation: 'daily',
    dayOfWeek: null,
    year: null,
  });

  const [data, setData] = useState<DataState>({
    dataInfo: null,
    tourA: null,
    tourB: null,
    hourlyData: [],
    weeklyData: [],
    monthlyData: [],
    timeSeriesData: [],
    insights: [],
    loading: true,
    error: null,
  });

  const fetchAllData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch all data in parallel
      const [dataInfoRes, summaryRes, hourlyRes, weeklyRes, monthlyRes, timeSeriesRes, insightsRes] = await Promise.all([
        getDataInfo(),
        getSummary({
          month: filters.month || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        }),
        getHourlyData({
          month: filters.month || undefined,
          dayOfWeek: filters.dayOfWeek !== null ? filters.dayOfWeek : undefined,
        }),
        getWeeklyData({
          month: filters.month || undefined,
        }),
        getMonthlyData({
          year: filters.year || undefined,
        }),
        getTimeSeriesData({
          month: filters.month || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          aggregation: filters.aggregation,
        }),
        getInsights({
          month: filters.month || undefined,
        }),
      ]);

      setData({
        dataInfo: dataInfoRes,
        tourA: summaryRes.tourA,
        tourB: summaryRes.tourB,
        hourlyData: hourlyRes.data || [],
        weeklyData: weeklyRes.data || [],
        monthlyData: monthlyRes.data || [],
        timeSeriesData: timeSeriesRes.data || [],
        insights: insightsRes.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Failed to fetch data: ${err.message}` 
        : 'Failed to connect to API server';
      console.error('Data fetch error:', err);
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [filters]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const setMonth = (month: string | null) => {
    setFilters(prev => ({ ...prev, month }));
  };

  const setDateRange = (start: string | null, end: string | null) => {
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
  };

  const setAggregation = (aggregation: 'daily' | 'hourly' | 'weekly') => {
    setFilters(prev => ({ ...prev, aggregation }));
  };

  const setDayOfWeek = (dayOfWeek: number | null) => {
    setFilters(prev => ({ ...prev, dayOfWeek }));
  };

  const setYear = (year: string | null) => {
    setFilters(prev => ({ ...prev, year }));
  };

  const clearFilters = () => {
    setFilters({
      month: null,
      startDate: null,
      endDate: null,
      aggregation: 'daily',
      dayOfWeek: null,
      year: null,
    });
  };

  const value: DataContextType = {
    ...data,
    filters,
    setMonth,
    setDateRange,
    setAggregation,
    setDayOfWeek,
    setYear,
    refreshData: fetchAllData,
    clearFilters,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
