// Auto-generated data from data_exploration_v2.py
// Generated at: 2025-11-28T01:40:31.713706

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
  loadFactor: number;
  peakToAvgRatio: number;
  totalEnergyKwh: number;
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

export interface MonthlyData {
  month: string;
  monthName: string;
  tourA: number;
  tourB: number;
}

export interface KeyInsight {
  title: string;
  value: string;
  description: string;
  icon: string;
}

// Summary data for Tour A and Tour B
export const tourSummary: TourData[] = [
  {
    "name": "Tour A",
    "avgPower": 3.23,
    "maxPower": 9.94,
    "minPower": 1.11,
    "powerFactor": 0,
    "weekdayAvg": 3.6,
    "weekendAvg": 2.29,
    "dataCoverage": 81.4,
    "estimatedDailyKwh": 77.6,
    "estimatedMonthlyKwh": 2328.0,
    "loadFactor": 0.325,
    "peakToAvgRatio": 3.07,
    "totalEnergyKwh": 9470.0
  },
  {
    "name": "Tour B",
    "avgPower": 3.37,
    "maxPower": 12.43,
    "minPower": 1.09,
    "powerFactor": 0,
    "weekdayAvg": 3.73,
    "weekendAvg": 2.41,
    "dataCoverage": 99.1,
    "estimatedDailyKwh": 80.9,
    "estimatedMonthlyKwh": 2428.0,
    "loadFactor": 0.271,
    "peakToAvgRatio": 3.69,
    "totalEnergyKwh": 12026.0
  }
];

// Hourly consumption patterns
export const hourlyData: HourlyData[] = [
  {
    "hour": 0,
    "tourA": 2.25,
    "tourB": 2.3,
    "difference": 0.05
  },
  {
    "hour": 1,
    "tourA": 2.24,
    "tourB": 2.28,
    "difference": 0.04
  },
  {
    "hour": 2,
    "tourA": 2.24,
    "tourB": 2.29,
    "difference": 0.05
  },
  {
    "hour": 3,
    "tourA": 2.24,
    "tourB": 2.28,
    "difference": 0.04
  },
  {
    "hour": 4,
    "tourA": 2.24,
    "tourB": 2.29,
    "difference": 0.04
  },
  {
    "hour": 5,
    "tourA": 2.21,
    "tourB": 2.29,
    "difference": 0.08
  },
  {
    "hour": 6,
    "tourA": 2.32,
    "tourB": 2.38,
    "difference": 0.07
  },
  {
    "hour": 7,
    "tourA": 2.33,
    "tourB": 2.93,
    "difference": 0.59
  },
  {
    "hour": 8,
    "tourA": 2.95,
    "tourB": 3.5,
    "difference": 0.54
  },
  {
    "hour": 9,
    "tourA": 5.3,
    "tourB": 5.29,
    "difference": -0.01
  },
  {
    "hour": 10,
    "tourA": 5.39,
    "tourB": 5.53,
    "difference": 0.14
  },
  {
    "hour": 11,
    "tourA": 5.54,
    "tourB": 5.59,
    "difference": 0.05
  },
  {
    "hour": 12,
    "tourA": 4.81,
    "tourB": 4.99,
    "difference": 0.18
  },
  {
    "hour": 13,
    "tourA": 4.4,
    "tourB": 4.64,
    "difference": 0.24
  },
  {
    "hour": 14,
    "tourA": 4.91,
    "tourB": 5.02,
    "difference": 0.1
  },
  {
    "hour": 15,
    "tourA": 4.82,
    "tourB": 4.93,
    "difference": 0.12
  },
  {
    "hour": 16,
    "tourA": 4.35,
    "tourB": 4.35,
    "difference": -0.0
  },
  {
    "hour": 17,
    "tourA": 3.18,
    "tourB": 3.09,
    "difference": -0.09
  },
  {
    "hour": 18,
    "tourA": 2.77,
    "tourB": 2.77,
    "difference": 0.0
  },
  {
    "hour": 19,
    "tourA": 2.58,
    "tourB": 2.61,
    "difference": 0.03
  },
  {
    "hour": 20,
    "tourA": 2.48,
    "tourB": 2.52,
    "difference": 0.04
  },
  {
    "hour": 21,
    "tourA": 2.35,
    "tourB": 2.44,
    "difference": 0.09
  },
  {
    "hour": 22,
    "tourA": 2.29,
    "tourB": 2.38,
    "difference": 0.1
  },
  {
    "hour": 23,
    "tourA": 2.26,
    "tourB": 2.34,
    "difference": 0.08
  }
];

// Weekly consumption patterns
export const weeklyData: DailyData[] = [
  {
    "day": "Monday",
    "dayIndex": 0,
    "tourA": 3.8,
    "tourB": 3.87
  },
  {
    "day": "Tuesday",
    "dayIndex": 1,
    "tourA": 3.68,
    "tourB": 4.0
  },
  {
    "day": "Wednesday",
    "dayIndex": 2,
    "tourA": 3.37,
    "tourB": 3.43
  },
  {
    "day": "Thursday",
    "dayIndex": 3,
    "tourA": 3.69,
    "tourB": 3.82
  },
  {
    "day": "Friday",
    "dayIndex": 4,
    "tourA": 3.48,
    "tourB": 3.58
  },
  {
    "day": "Saturday",
    "dayIndex": 5,
    "tourA": 2.39,
    "tourB": 2.49
  },
  {
    "day": "Sunday",
    "dayIndex": 6,
    "tourA": 2.2,
    "tourB": 2.33
  }
];

// Time series data (daily averages)
export const timeSeriesData: TimeSeriesData[] = [
  {
    "date": "2023-11-01",
    "tourA": 4.07,
    "tourB": 4.59
  },
  {
    "date": "2023-11-02",
    "tourA": 4.06,
    "tourB": 4.28
  },
  {
    "date": "2023-11-03",
    "tourA": 4.61,
    "tourB": 4.27
  },
  {
    "date": "2023-11-04",
    "tourA": 2.74,
    "tourB": 3.4
  },
  {
    "date": "2023-11-05",
    "tourA": 2.24,
    "tourB": 3.62
  },
  {
    "date": "2023-11-06",
    "tourA": 4.25,
    "tourB": 4.94
  },
  {
    "date": "2023-11-07",
    "tourA": 4.02,
    "tourB": 5.42
  },
  {
    "date": "2023-11-08",
    "tourA": 2.78,
    "tourB": 3.14
  },
  {
    "date": "2023-11-09",
    "tourA": 3.92,
    "tourB": 5.09
  },
  {
    "date": "2023-11-10",
    "tourA": 3.96,
    "tourB": 3.73
  },
  {
    "date": "2023-11-11",
    "tourA": 2.0,
    "tourB": 2.4
  },
  {
    "date": "2023-11-12",
    "tourA": 2.08,
    "tourB": 2.16
  },
  {
    "date": "2023-11-13",
    "tourA": 3.94,
    "tourB": 4.29
  },
  {
    "date": "2023-11-14",
    "tourA": 3.37,
    "tourB": 4.21
  },
  {
    "date": "2023-11-15",
    "tourA": 3.16,
    "tourB": 3.51
  },
  {
    "date": "2023-11-16",
    "tourA": 3.82,
    "tourB": 4.67
  },
  {
    "date": "2023-11-17",
    "tourA": 3.77,
    "tourB": 3.95
  },
  {
    "date": "2023-11-18",
    "tourA": 1.91,
    "tourB": 2.56
  },
  {
    "date": "2023-11-19",
    "tourA": 1.77,
    "tourB": 2.4
  },
  {
    "date": "2023-11-20",
    "tourA": 4.22,
    "tourB": 4.7
  },
  {
    "date": "2023-11-21",
    "tourA": 3.94,
    "tourB": 4.86
  },
  {
    "date": "2023-11-22",
    "tourA": 3.89,
    "tourB": 3.27
  },
  {
    "date": "2023-11-23",
    "tourA": 3.82,
    "tourB": 5.09
  },
  {
    "date": "2023-11-24",
    "tourA": 3.66,
    "tourB": 4.45
  },
  {
    "date": "2023-11-25",
    "tourA": 1.68,
    "tourB": 2.31
  },
  {
    "date": "2023-11-26",
    "tourA": 1.59,
    "tourB": 2.09
  },
  {
    "date": "2023-11-27",
    "tourA": 4.04,
    "tourB": 4.35
  },
  {
    "date": "2023-11-28",
    "tourA": 3.97,
    "tourB": 5.39
  },
  {
    "date": "2023-11-29",
    "tourA": 3.39,
    "tourB": 3.79
  },
  {
    "date": "2023-11-30",
    "tourA": 4.23,
    "tourB": 4.54
  },
  {
    "date": "2023-12-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2023-12-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-01-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-02-01",
    "tourA": 4.12,
    "tourB": 4.47
  },
  {
    "date": "2024-02-02",
    "tourA": 3.61,
    "tourB": 4.06
  },
  {
    "date": "2024-02-03",
    "tourA": 3.3,
    "tourB": 2.36
  },
  {
    "date": "2024-02-04",
    "tourA": 2.11,
    "tourB": 2.36
  },
  {
    "date": "2024-02-05",
    "tourA": 3.58,
    "tourB": 4.01
  },
  {
    "date": "2024-02-06",
    "tourA": 3.72,
    "tourB": 4.2
  },
  {
    "date": "2024-02-07",
    "tourA": 3.53,
    "tourB": 4.18
  },
  {
    "date": "2024-02-08",
    "tourA": 4.09,
    "tourB": 3.93
  },
  {
    "date": "2024-02-09",
    "tourA": 3.95,
    "tourB": 3.66
  },
  {
    "date": "2024-02-10",
    "tourA": 2.31,
    "tourB": 2.7
  },
  {
    "date": "2024-02-11",
    "tourA": 2.16,
    "tourB": 2.31
  },
  {
    "date": "2024-02-12",
    "tourA": 3.97,
    "tourB": 4.5
  },
  {
    "date": "2024-02-13",
    "tourA": 4.65,
    "tourB": 4.24
  },
  {
    "date": "2024-02-14",
    "tourA": 4.0,
    "tourB": 4.25
  },
  {
    "date": "2024-02-15",
    "tourA": 4.27,
    "tourB": 4.36
  },
  {
    "date": "2024-02-16",
    "tourA": 3.78,
    "tourB": 3.96
  },
  {
    "date": "2024-02-17",
    "tourA": 2.68,
    "tourB": 2.32
  },
  {
    "date": "2024-02-18",
    "tourA": 2.53,
    "tourB": 2.08
  },
  {
    "date": "2024-02-19",
    "tourA": 4.1,
    "tourB": 4.39
  },
  {
    "date": "2024-02-20",
    "tourA": 4.03,
    "tourB": 4.32
  },
  {
    "date": "2024-02-21",
    "tourA": 3.38,
    "tourB": 4.06
  },
  {
    "date": "2024-02-22",
    "tourA": 3.97,
    "tourB": 4.86
  },
  {
    "date": "2024-02-23",
    "tourA": 3.4,
    "tourB": 4.22
  },
  {
    "date": "2024-02-24",
    "tourA": 2.07,
    "tourB": 2.8
  },
  {
    "date": "2024-02-25",
    "tourA": 1.87,
    "tourB": 2.61
  },
  {
    "date": "2024-02-26",
    "tourA": 3.37,
    "tourB": 4.41
  },
  {
    "date": "2024-02-27",
    "tourA": 4.03,
    "tourB": 4.02
  },
  {
    "date": "2024-02-28",
    "tourA": 3.66,
    "tourB": 4.22
  },
  {
    "date": "2024-02-29",
    "tourA": 3.43,
    "tourB": 4.3
  },
  {
    "date": "2024-03-01",
    "tourA": 3.26,
    "tourB": 4.01
  },
  {
    "date": "2024-03-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-03-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-04-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-05-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-06-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-07-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-08-01",
    "tourA": 2.97,
    "tourB": 3.05
  },
  {
    "date": "2024-08-02",
    "tourA": 2.44,
    "tourB": 3.02
  },
  {
    "date": "2024-08-03",
    "tourA": 2.43,
    "tourB": 2.88
  },
  {
    "date": "2024-08-04",
    "tourA": 2.45,
    "tourB": 2.88
  },
  {
    "date": "2024-08-05",
    "tourA": 2.46,
    "tourB": 2.94
  },
  {
    "date": "2024-08-06",
    "tourA": 2.52,
    "tourB": 2.94
  },
  {
    "date": "2024-08-07",
    "tourA": 3.08,
    "tourB": 3.04
  },
  {
    "date": "2024-08-08",
    "tourA": 2.63,
    "tourB": 2.95
  },
  {
    "date": "2024-08-09",
    "tourA": 2.48,
    "tourB": 2.99
  },
  {
    "date": "2024-08-10",
    "tourA": 2.47,
    "tourB": 2.93
  },
  {
    "date": "2024-08-11",
    "tourA": 2.48,
    "tourB": 2.92
  },
  {
    "date": "2024-08-12",
    "tourA": 3.35,
    "tourB": 3.29
  },
  {
    "date": "2024-08-13",
    "tourA": 2.84,
    "tourB": 3.02
  },
  {
    "date": "2024-08-14",
    "tourA": 3.52,
    "tourB": 3.52
  },
  {
    "date": "2024-08-15",
    "tourA": 3.13,
    "tourB": 3.74
  },
  {
    "date": "2024-08-16",
    "tourA": 2.84,
    "tourB": 3.62
  },
  {
    "date": "2024-08-17",
    "tourA": 2.49,
    "tourB": 3.12
  },
  {
    "date": "2024-08-18",
    "tourA": 2.64,
    "tourB": 3.11
  },
  {
    "date": "2024-08-19",
    "tourA": 3.39,
    "tourB": 3.46
  },
  {
    "date": "2024-08-20",
    "tourA": 3.25,
    "tourB": 3.21
  },
  {
    "date": "2024-08-21",
    "tourA": 3.17,
    "tourB": 3.33
  },
  {
    "date": "2024-08-22",
    "tourA": 3.09,
    "tourB": 3.21
  },
  {
    "date": "2024-08-23",
    "tourA": 2.97,
    "tourB": 3.57
  },
  {
    "date": "2024-08-24",
    "tourA": 2.43,
    "tourB": 3.53
  },
  {
    "date": "2024-08-25",
    "tourA": 2.54,
    "tourB": 3.5
  },
  {
    "date": "2024-08-26",
    "tourA": 3.46,
    "tourB": 4.06
  },
  {
    "date": "2024-08-27",
    "tourA": 3.41,
    "tourB": 3.66
  },
  {
    "date": "2024-08-28",
    "tourA": 3.42,
    "tourB": 3.45
  },
  {
    "date": "2024-08-29",
    "tourA": 3.44,
    "tourB": 3.57
  },
  {
    "date": "2024-08-30",
    "tourA": 3.6,
    "tourB": 3.78
  },
  {
    "date": "2024-08-31",
    "tourA": 3.13,
    "tourB": 3.75
  },
  {
    "date": "2024-09-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-09-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-10-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-11-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-01",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-02",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-03",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-04",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-05",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-06",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-07",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-08",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-09",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-10",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-11",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-12",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-13",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-14",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-15",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-16",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-17",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-18",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-19",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-20",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-21",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-22",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-23",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-24",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-25",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-26",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-27",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-28",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-29",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-30",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2024-12-31",
    "tourA": 0,
    "tourB": 0
  },
  {
    "date": "2025-01-01",
    "tourA": 0,
    "tourB": 1.19
  },
  {
    "date": "2025-01-02",
    "tourA": 0,
    "tourB": 1.46
  },
  {
    "date": "2025-01-03",
    "tourA": 0,
    "tourB": 1.61
  },
  {
    "date": "2025-01-04",
    "tourA": 0,
    "tourB": 1.3
  },
  {
    "date": "2025-01-05",
    "tourA": 0,
    "tourB": 1.47
  },
  {
    "date": "2025-01-06",
    "tourA": 0,
    "tourB": 2.48
  },
  {
    "date": "2025-01-07",
    "tourA": 0,
    "tourB": 2.69
  },
  {
    "date": "2025-01-08",
    "tourA": 0,
    "tourB": 3.17
  },
  {
    "date": "2025-01-09",
    "tourA": 0,
    "tourB": 2.89
  },
  {
    "date": "2025-01-10",
    "tourA": 0,
    "tourB": 2.8
  },
  {
    "date": "2025-01-11",
    "tourA": 0,
    "tourB": 1.62
  },
  {
    "date": "2025-01-12",
    "tourA": 0,
    "tourB": 1.46
  },
  {
    "date": "2025-01-13",
    "tourA": 0,
    "tourB": 2.49
  },
  {
    "date": "2025-01-14",
    "tourA": 0,
    "tourB": 2.89
  },
  {
    "date": "2025-01-15",
    "tourA": 0,
    "tourB": 2.73
  },
  {
    "date": "2025-01-16",
    "tourA": 0,
    "tourB": 2.64
  },
  {
    "date": "2025-01-17",
    "tourA": 0,
    "tourB": 2.35
  },
  {
    "date": "2025-01-18",
    "tourA": 0,
    "tourB": 1.47
  },
  {
    "date": "2025-01-19",
    "tourA": 0,
    "tourB": 1.32
  },
  {
    "date": "2025-01-20",
    "tourA": 0,
    "tourB": 2.88
  },
  {
    "date": "2025-01-21",
    "tourA": 0,
    "tourB": 2.81
  },
  {
    "date": "2025-01-22",
    "tourA": 0,
    "tourB": 2.54
  },
  {
    "date": "2025-01-23",
    "tourA": 0,
    "tourB": 2.77
  },
  {
    "date": "2025-01-24",
    "tourA": 0,
    "tourB": 2.91
  },
  {
    "date": "2025-01-25",
    "tourA": 1.83,
    "tourB": 2.01
  },
  {
    "date": "2025-01-26",
    "tourA": 1.63,
    "tourB": 2.12
  },
  {
    "date": "2025-01-27",
    "tourA": 3.7,
    "tourB": 3.87
  },
  {
    "date": "2025-01-28",
    "tourA": 3.28,
    "tourB": 4.03
  },
  {
    "date": "2025-01-29",
    "tourA": 2.67,
    "tourB": 3.49
  },
  {
    "date": "2025-01-30",
    "tourA": 3.67,
    "tourB": 3.85
  },
  {
    "date": "2025-01-31",
    "tourA": 2.88,
    "tourB": 3.82
  },
  {
    "date": "2025-02-01",
    "tourA": 1.55,
    "tourB": 2.55
  },
  {
    "date": "2025-02-02",
    "tourA": 1.99,
    "tourB": 2.18
  },
  {
    "date": "2025-02-03",
    "tourA": 4.03,
    "tourB": 4.41
  },
  {
    "date": "2025-02-04",
    "tourA": 3.91,
    "tourB": 4.84
  },
  {
    "date": "2025-02-05",
    "tourA": 3.57,
    "tourB": 3.0
  },
  {
    "date": "2025-02-06",
    "tourA": 3.8,
    "tourB": 3.6
  },
  {
    "date": "2025-02-07",
    "tourA": 4.13,
    "tourB": 3.33
  },
  {
    "date": "2025-02-08",
    "tourA": 3.3,
    "tourB": 2.04
  },
  {
    "date": "2025-02-09",
    "tourA": 3.22,
    "tourB": 1.98
  },
  {
    "date": "2025-02-10",
    "tourA": 4.61,
    "tourB": 4.39
  },
  {
    "date": "2025-02-11",
    "tourA": 3.99,
    "tourB": 4.2
  },
  {
    "date": "2025-02-12",
    "tourA": 3.04,
    "tourB": 3.83
  },
  {
    "date": "2025-02-13",
    "tourA": 3.83,
    "tourB": 4.63
  },
  {
    "date": "2025-02-14",
    "tourA": 3.76,
    "tourB": 4.05
  },
  {
    "date": "2025-02-15",
    "tourA": 2.21,
    "tourB": 2.14
  },
  {
    "date": "2025-02-16",
    "tourA": 2.19,
    "tourB": 2.02
  },
  {
    "date": "2025-02-17",
    "tourA": 3.87,
    "tourB": 3.61
  },
  {
    "date": "2025-02-18",
    "tourA": 3.48,
    "tourB": 4.14
  },
  {
    "date": "2025-02-19",
    "tourA": 2.72,
    "tourB": 3.75
  },
  {
    "date": "2025-02-20",
    "tourA": 3.6,
    "tourB": 3.85
  },
  {
    "date": "2025-02-21",
    "tourA": 3.58,
    "tourB": 4.45
  },
  {
    "date": "2025-02-22",
    "tourA": 2.16,
    "tourB": 2.31
  },
  {
    "date": "2025-02-23",
    "tourA": 1.84,
    "tourB": 1.99
  },
  {
    "date": "2025-02-24",
    "tourA": 4.32,
    "tourB": 3.97
  },
  {
    "date": "2025-02-25",
    "tourA": 3.63,
    "tourB": 4.38
  },
  {
    "date": "2025-02-26",
    "tourA": 3.55,
    "tourB": 3.22
  },
  {
    "date": "2025-02-27",
    "tourA": 3.92,
    "tourB": 4.0
  },
  {
    "date": "2025-02-28",
    "tourA": 3.5,
    "tourB": 3.84
  }
];

// Monthly data
export const monthlyData: MonthlyData[] = [
  {
    "month": "2023-11",
    "monthName": "Nov 2023",
    "tourA": 3.35,
    "tourB": 3.92
  },
  {
    "month": "2023-12",
    "monthName": "Dec 2023",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-01",
    "monthName": "Jan 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-02",
    "monthName": "Feb 2024",
    "tourA": 3.42,
    "tourB": 3.73
  },
  {
    "month": "2024-03",
    "monthName": "Mar 2024",
    "tourA": 3.26,
    "tourB": 4.01
  },
  {
    "month": "2024-04",
    "monthName": "Apr 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-05",
    "monthName": "May 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-06",
    "monthName": "Jun 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-07",
    "monthName": "Jul 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-08",
    "monthName": "Aug 2024",
    "tourA": 2.93,
    "tourB": 3.3
  },
  {
    "month": "2024-09",
    "monthName": "Sep 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-10",
    "monthName": "Oct 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-11",
    "monthName": "Nov 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2024-12",
    "monthName": "Dec 2024",
    "tourA": 0,
    "tourB": 0
  },
  {
    "month": "2025-01",
    "monthName": "Jan 2025",
    "tourA": 2.9,
    "tourB": 2.49
  },
  {
    "month": "2025-02",
    "monthName": "Feb 2025",
    "tourA": 3.33,
    "tourB": 3.45
  }
];

// Key insights
export const keyInsights: KeyInsight[] = [
  {
    "title": "Energy Efficiency",
    "value": "4.3%",
    "description": "Tour A uses 4.3% less power on average",
    "icon": "\u26a1"
  },
  {
    "title": "Peak Hour",
    "value": "11:00 / 11:00",
    "description": "Tour A peaks at 11:00, Tour B at 11:00",
    "icon": "\ud83d\udcc8"
  },
  {
    "title": "Weekend Savings",
    "value": "36%",
    "description": "Average weekend consumption drop (A: 36%, B: 35%)",
    "icon": "\ud83d\udcc5"
  },
  {
    "title": "Monthly Usage",
    "value": "~4.8 MWh",
    "description": "Combined monthly consumption estimate",
    "icon": "\ud83d\udd0c"
  },
  {
    "title": "Load Factor",
    "value": "0.33 / 0.27",
    "description": "Load factor comparison (A / B). Higher is better.",
    "icon": "\ud83d\udcca"
  },
  {
    "title": "Data Coverage",
    "value": "81% / 99%",
    "description": "Available data percentage for Tour A / Tour B",
    "icon": "\ud83d\udcc1"
  }
];

// Date range
export const dateRange = {
  "start": "2023-11-01 00:00:00",
  "end": "2025-02-28 23:45:00"
};
