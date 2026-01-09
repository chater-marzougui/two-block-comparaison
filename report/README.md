# Technical Report: Tour A vs Tour B Power Consumption Analysis

## Overview
This folder contains a comprehensive technical report detailing the structure, analysis, and findings of the Tour A vs Tour B power consumption comparison project.

## Report Contents

### Document Information
- **Title**: Tour A vs Tour B - Power Consumption Comparative Analysis
- **Date**: January 3, 2026
- **Authors**: 
  - Chater Marzougui
  - Brahim Ben Lamin Ghouma
- **Pages**: 26 pages
- **Format**: LaTeX source + PDF output

### Report Structure

1. **Abstract**: Executive summary of the project and key findings
2. **Introduction**: Project overview, objectives, and data description
3. **System Architecture**: Complete technical stack and data flow
4. **Data Exploration V1**: Initial analysis with 6 visualization outputs
5. **Data Exploration V2**: Enhanced analysis with 4 additional metrics
6. **AI/ML Forecasting Models**: 
   - Model descriptions (LSTM, Prophet, ElasticNet, Exponential Smoothing, Random Forest)
   - Performance metrics for Tour A and Tour B
   - 1-week and 1-month forecasting scenarios
7. **Backend Infrastructure**: Flask API architecture and endpoints
8. **Frontend Dashboard**: React-based interactive visualization platform
9. **Analysis**: Why Block B Consumes More Than Block A
   - Quantitative differences
   - Root cause analysis
   - Recommendations for improvement
10. **Conclusions**: Summary, achievements, and future work

### Files in this Folder

- `technical_report.tex` - LaTeX source document
- `technical_report.pdf` - Generated PDF report
- `images/` - Directory containing all figures used in the report
  - Data exploration outputs (v1: 01-06, v2: v2_01-v2_04)
  - Model performance metrics (Tour A & B, comparison charts)
  - Model rankings and metric tables

## Key Findings

### Consumption Differences
- **Average Power**: Tour B consumes 14.2% more than Tour A (4.15 kW vs 3.63 kW)
- **Peak Power**: Tour B shows 3.6x higher peak demand (73.01 kW vs 20.24 kW)
- **Power Factor**: Tour A has better efficiency (0.892 vs -0.762 for Tour B)

### Root Causes
1. Power factor discrepancy indicating reactive power issues in Tour B
2. Higher weekday-weekend variation (79.2% for Tour B)
3. Significantly higher peak loads
4. Greater consumption variability

### Recommendations
- Install power factor correction equipment
- Implement load management system
- Conduct equipment audit
- Schedule high-power operations to avoid simultaneous use

## Compiling the Report

To recompile the LaTeX document:

```bash
cd report
pdflatex technical_report.tex
pdflatex technical_report.tex  # Run twice for TOC and references
```

### Requirements
- LaTeX distribution (TeX Live or MiKTeX)
- Required packages: graphicx, hyperref, booktabs, geometry, and others (all standard)

## Images Used

All images are stored in the `images/` subdirectory and include:

### Data Exploration V1
- `01_power_timeseries.png` - Complete time series analysis
- `02_hourly_patterns.png` - Hourly consumption patterns
- `03_distribution_comparison.png` - Statistical distributions
- `04_weekly_patterns.png` - Day-of-week patterns
- `05_efficiency_comparison.png` - Efficiency metrics
- `06_cumulative_energy.png` - Cumulative consumption

### Data Exploration V2
- `v2_01_monthly_comparison.png` - Monthly trends
- `v2_02_heatmap_comparison.png` - Consumption heatmap
- `v2_03_efficiency_metrics.png` - Enhanced efficiency analysis
- `v2_04_peak_analysis.png` - Peak load analysis

### Model Performance Metrics
- Tour A 1-week forecast metrics (comparison, table, ranking)
- Tour A 1-month forecast metrics (comparison, table, ranking)
- Tour B 1-week forecast metrics (comparison, table)
- Tour B 1-month forecast metrics (comparison, table)
- Comparative analysis charts (1-week and 1-month comparisons)

## Technical Details

### LaTeX Configuration
- Document class: article, 12pt, A4 paper
- Margins: 2.5cm on all sides
- Custom colors for sections and titles
- Headers and footers configured with fancyhdr
- Hyperlinks enabled for table of contents

### Image Descriptions
Each image in the report includes:
- Figure caption describing the visualization
- Significance paragraph explaining the importance and key insights
- Context within the broader analysis

## Usage

The PDF report can be:
- Printed for documentation purposes
- Shared with stakeholders
- Used as a reference for project understanding
- Included in project deliverables

## Notes

- The report synthesizes information from multiple data sources
- All visualizations are generated from actual project data
- Model performance metrics are based on saved model outputs
- No models were retrained for this report (as specified in requirements)
- Dashboard screenshots would need to be captured from running application

## Contact

For questions or clarifications about the report:
- Chater Marzougui
- Brahim Ben Lamin Ghouma
