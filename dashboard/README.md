# Power Consumption Dashboard

Interactive React dashboard for visualizing and comparing power consumption between Tour A and Tour B buildings.

## Features

- **Dynamic Filtering**: Filter data by month, day of week, and time aggregation
- **Real-time Data**: Fetches data from Flask backend API
- **Fallback Mode**: Works with static data when API is unavailable
- **Interactive Charts**: Built with Recharts for smooth animations
- **Responsive Design**: Works on desktop and mobile devices

## Components

| Component | Description |
|-----------|-------------|
| `FilterPanel` | Interactive filter controls for month, day, and aggregation |
| `StatCard` | Summary statistics display cards |
| `HourlyChart` | Bar chart showing hourly consumption patterns |
| `WeeklyChart` | Weekly consumption comparison |
| `MonthlyChart` | Monthly trends with energy estimates |
| `TimeSeriesChart` | Daily/hourly time series visualization |
| `EfficiencyMetrics` | Load factor, energy consumption metrics |
| `InsightCards` | Key insights and findings |
| `ComparisonRadar` | Multi-dimensional comparison radar chart |
| `TourComparison` | Side-by-side metric comparison table |

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Flask backend running (optional, for live data)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The dashboard will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file to configure the API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Architecture

```
src/
├── components/          # React UI components
│   ├── FilterPanel.tsx  # Filter controls
│   ├── StatCard.tsx     # Stats display
│   ├── HourlyChart.tsx  # Hourly patterns
│   ├── WeeklyChart.tsx  # Weekly patterns
│   ├── MonthlyChart.tsx # Monthly trends
│   ├── TimeSeriesChart.tsx
│   ├── EfficiencyMetrics.tsx
│   ├── InsightCards.tsx
│   ├── ComparisonRadar.tsx
│   └── TourComparison.tsx
├── context/
│   └── DataContext.tsx  # Global state management
├── services/
│   └── api.ts           # API client
├── App.tsx              # Main application
└── App.css              # Global styles
```

## Data Flow

1. **DataContext** manages global state and fetches data from API
2. **FilterPanel** allows users to set filters
3. Filter changes trigger new API requests
4. Components render updated data automatically
5. Falls back to static data if API is unavailable

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`

Builds the app for production to the `build` folder

### `npm test`

Launches the test runner

## Dependencies

- **React 18**: UI framework
- **Recharts**: Charting library
- **Framer Motion**: Animations
- **TypeScript**: Type safety

## Styling

Uses CSS with:
- CSS Grid for responsive layouts
- CSS custom properties for theming
- Gradient backgrounds for visual appeal
- Smooth transitions and animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
