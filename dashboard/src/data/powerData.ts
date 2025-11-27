// Power consumption data extracted from the analysis
// Data covers January 2025 to February 2025

export interface TourData {
  name: string;
  avgPower: number;
  maxPower: number;
  minPower: number;
  powerFactor: number;
  weekdayAvg: number;
  weekendAvg: number;
  dataCoverage: number;
  estimatedDailyKwh: number;
  estimatedMonthlyKwh: number;
}

export interface HourlyData {
  hour: number;
  tourA: number;
  tourB: number;
  difference: number;
}

export interface DailyData {
  day: string;
  dayIndex: number;
  tourA: number;
  tourB: number;
}

export interface TimeSeriesData {
  date: string;
  tourA: number;
  tourB: number;
}

// Summary data for Tour A and Tour B
export const tourSummary: TourData[] = [
  {
    name: "Tour A",
    avgPower: 3.30,
    maxPower: 10.89,
    minPower: 1.50,
    powerFactor: 1.0,
    weekdayAvg: 3.70,
    weekendAvg: 2.22,
    dataCoverage: 58.3,
    estimatedDailyKwh: 79.2,
    estimatedMonthlyKwh: 2376
  },
  {
    name: "Tour B",
    avgPower: 2.95,
    maxPower: 10.87,
    minPower: 1.20,
    powerFactor: 0.807,
    weekdayAvg: 3.35,
    weekendAvg: 1.87,
    dataCoverage: 100,
    estimatedDailyKwh: 70.7,
    estimatedMonthlyKwh: 2122
  }
];

// Hourly consumption patterns (average kW per hour)
export const hourlyData: HourlyData[] = [
  { hour: 0, tourA: 2.05, tourB: 1.92, difference: -0.13 },
  { hour: 1, tourA: 2.02, tourB: 1.88, difference: -0.14 },
  { hour: 2, tourA: 2.00, tourB: 1.85, difference: -0.15 },
  { hour: 3, tourA: 2.00, tourB: 1.85, difference: -0.15 },
  { hour: 4, tourA: 2.02, tourB: 1.88, difference: -0.14 },
  { hour: 5, tourA: 2.05, tourB: 1.90, difference: -0.15 },
  { hour: 6, tourA: 2.10, tourB: 1.95, difference: -0.15 },
  { hour: 7, tourA: 2.25, tourB: 2.50, difference: 0.25 },
  { hour: 8, tourA: 2.55, tourB: 3.10, difference: 0.55 },
  { hour: 9, tourA: 5.50, tourB: 4.90, difference: -0.60 },
  { hour: 10, tourA: 6.20, tourB: 5.12, difference: -1.08 },
  { hour: 11, tourA: 6.70, tourB: 5.05, difference: -1.65 },
  { hour: 12, tourA: 5.40, tourB: 4.55, difference: -0.85 },
  { hour: 13, tourA: 5.55, tourB: 4.50, difference: -1.05 },
  { hour: 14, tourA: 5.50, tourB: 4.60, difference: -0.90 },
  { hour: 15, tourA: 5.45, tourB: 4.65, difference: -0.80 },
  { hour: 16, tourA: 4.65, tourB: 4.00, difference: -0.65 },
  { hour: 17, tourA: 3.05, tourB: 2.75, difference: -0.30 },
  { hour: 18, tourA: 2.45, tourB: 2.30, difference: -0.15 },
  { hour: 19, tourA: 2.25, tourB: 2.25, difference: 0.00 },
  { hour: 20, tourA: 2.15, tourB: 2.15, difference: 0.00 },
  { hour: 21, tourA: 2.10, tourB: 2.05, difference: -0.05 },
  { hour: 22, tourA: 2.05, tourB: 1.98, difference: -0.07 },
  { hour: 23, tourA: 2.00, tourB: 1.95, difference: -0.05 }
];

// Weekly consumption patterns
export const weeklyData: DailyData[] = [
  { day: "Monday", dayIndex: 0, tourA: 3.85, tourB: 3.50 },
  { day: "Tuesday", dayIndex: 1, tourA: 3.90, tourB: 3.55 },
  { day: "Wednesday", dayIndex: 2, tourA: 3.75, tourB: 3.40 },
  { day: "Thursday", dayIndex: 3, tourA: 3.70, tourB: 3.35 },
  { day: "Friday", dayIndex: 4, tourA: 3.30, tourB: 2.95 },
  { day: "Saturday", dayIndex: 5, tourA: 2.25, tourB: 1.90 },
  { day: "Sunday", dayIndex: 6, tourA: 2.20, tourB: 1.85 }
];

// Sample time series data (daily averages)
export const timeSeriesData: TimeSeriesData[] = [
  { date: "2025-01-01", tourA: 0, tourB: 1.22 },
  { date: "2025-01-02", tourA: 0, tourB: 1.50 },
  { date: "2025-01-03", tourA: 0, tourB: 1.65 },
  { date: "2025-01-04", tourA: 0, tourB: 1.35 },
  { date: "2025-01-05", tourA: 0, tourB: 1.32 },
  { date: "2025-01-06", tourA: 0, tourB: 2.50 },
  { date: "2025-01-07", tourA: 0, tourB: 2.75 },
  { date: "2025-01-08", tourA: 0, tourB: 3.20 },
  { date: "2025-01-09", tourA: 0, tourB: 2.90 },
  { date: "2025-01-10", tourA: 0, tourB: 2.95 },
  { date: "2025-01-11", tourA: 0, tourB: 1.65 },
  { date: "2025-01-12", tourA: 0, tourB: 1.50 },
  { date: "2025-01-13", tourA: 0, tourB: 2.50 },
  { date: "2025-01-14", tourA: 0, tourB: 2.90 },
  { date: "2025-01-15", tourA: 0, tourB: 2.65 },
  { date: "2025-01-16", tourA: 0, tourB: 2.40 },
  { date: "2025-01-17", tourA: 0, tourB: 2.60 },
  { date: "2025-01-18", tourA: 0, tourB: 1.50 },
  { date: "2025-01-19", tourA: 0, tourB: 1.35 },
  { date: "2025-01-20", tourA: 0, tourB: 2.90 },
  { date: "2025-01-21", tourA: 0, tourB: 2.85 },
  { date: "2025-01-22", tourA: 0, tourB: 2.60 },
  { date: "2025-01-23", tourA: 0, tourB: 2.55 },
  { date: "2025-01-24", tourA: 0, tourB: 2.65 },
  { date: "2025-01-25", tourA: 0, tourB: 1.95 },
  { date: "2025-01-26", tourA: 0, tourB: 2.00 },
  { date: "2025-01-27", tourA: 3.85, tourB: 3.90 },
  { date: "2025-01-28", tourA: 3.50, tourB: 3.85 },
  { date: "2025-01-29", tourA: 3.95, tourB: 4.10 },
  { date: "2025-01-30", tourA: 3.55, tourB: 3.50 },
  { date: "2025-01-31", tourA: 2.55, tourB: 2.55 },
  { date: "2025-02-01", tourA: 2.20, tourB: 2.15 },
  { date: "2025-02-02", tourA: 4.45, tourB: 4.10 },
  { date: "2025-02-03", tourA: 4.00, tourB: 3.95 },
  { date: "2025-02-04", tourA: 4.85, tourB: 4.90 },
  { date: "2025-02-05", tourA: 4.85, tourB: 3.85 },
  { date: "2025-02-06", tourA: 4.35, tourB: 3.90 },
  { date: "2025-02-07", tourA: 4.85, tourB: 3.90 },
  { date: "2025-02-08", tourA: 3.25, tourB: 3.30 },
  { date: "2025-02-09", tourA: 4.85, tourB: 3.90 },
  { date: "2025-02-10", tourA: 4.30, tourB: 3.85 },
  { date: "2025-02-11", tourA: 4.70, tourB: 3.95 },
  { date: "2025-02-12", tourA: 4.35, tourB: 3.85 },
  { date: "2025-02-13", tourA: 4.70, tourB: 3.90 },
  { date: "2025-02-14", tourA: 2.20, tourB: 2.15 },
  { date: "2025-02-15", tourA: 2.15, tourB: 2.20 },
  { date: "2025-02-16", tourA: 4.10, tourB: 3.90 },
  { date: "2025-02-17", tourA: 3.90, tourB: 3.85 },
  { date: "2025-02-18", tourA: 4.05, tourB: 3.85 },
  { date: "2025-02-19", tourA: 3.85, tourB: 3.80 },
  { date: "2025-02-20", tourA: 3.85, tourB: 3.95 },
  { date: "2025-02-21", tourA: 2.35, tourB: 1.95 },
  { date: "2025-02-22", tourA: 2.40, tourB: 2.40 },
  { date: "2025-02-23", tourA: 4.50, tourB: 3.85 },
  { date: "2025-02-24", tourA: 4.45, tourB: 4.50 },
  { date: "2025-02-25", tourA: 4.00, tourB: 4.05 },
  { date: "2025-02-26", tourA: 3.60, tourB: 3.90 },
  { date: "2025-02-27", tourA: 4.00, tourB: 4.00 },
  { date: "2025-02-28", tourA: 3.85, tourB: 3.85 }
];

// Key insights for display
export const keyInsights = [
  {
    title: "Energy Efficiency",
    value: "10.6%",
    description: "Tour B uses 10.6% less power than Tour A on average",
    icon: "⚡"
  },
  {
    title: "Peak Hour",
    value: "11:00",
    description: "Both buildings reach peak consumption around 11 AM",
    icon: "📈"
  },
  {
    title: "Weekend Savings",
    value: "40%",
    description: "Weekend consumption drops ~40% compared to weekdays",
    icon: "📅"
  },
  {
    title: "Monthly Usage",
    value: "~2,250 kWh",
    description: "Average combined monthly consumption",
    icon: "🔌"
  }
];
