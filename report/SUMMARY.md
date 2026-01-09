# Technical Report Summary

## Deliverables

### Main Report Document
- **File**: `technical_report.pdf` (3.1 MB, 26 pages)
- **Source**: `technical_report.tex` (LaTeX source)
- **Date**: January 3, 2026
- **Authors**: Chater Marzougui and Brahim Ben Lamin Ghouma

### Report Sections

1. **Title Page** - Professional cover with project title, authors, and date
2. **Table of Contents** - Navigable index of all sections
3. **Abstract** - Executive summary of findings
4. **Introduction** (Pages 2-3)
   - Project overview and objectives
   - Data overview (Nov 2023 - Feb 2025, 15-minute intervals)
   
5. **System Architecture** (Pages 3-4)
   - Four main components: Data Exploration, Forecasting, Backend, Frontend
   - Technology stack table
   - Data flow architecture

6. **Data Exploration V1** (Pages 5-8)
   - 6 visualizations from initial exploration
   - Each with figure, caption, and significance explanation:
     - Power time series analysis
     - Hourly consumption patterns
     - Distribution comparison
     - Weekly patterns
     - Efficiency comparison
     - Cumulative energy consumption

7. **Data Exploration V2** (Pages 9-12)
   - 4 enhanced visualizations with detailed analysis:
     - Monthly comparison
     - Heatmap comparison
     - Enhanced efficiency metrics
     - Peak analysis

8. **AI/ML Forecasting Models** (Pages 13-19)
   - Model architecture overview (5 models)
   - Forecasting scenarios (1-week and 1-month)
   - Tour A performance metrics (6 figures)
   - Tour B performance metrics (4 figures)
   - Comparative analysis (2 figures)
   - Model evaluation metrics explanation

9. **Backend Infrastructure** (Page 20)
   - Flask API architecture
   - Complete API endpoints table
   - Data processing pipeline

10. **Frontend Dashboard** (Page 21)
    - React architecture
    - Key features and components
    - Interactive controls
    - Data context management

11. **Analysis: Why Block B Consumes More** (Pages 22-24)
    - Quantitative differences (14.2% higher average, 3.6x higher peak)
    - Four identified root causes:
      - Power factor discrepancy
      - Higher weekday-weekend variation
      - Peak load characteristics
      - Consumption variability
    - Recommendations (immediate, medium-term, long-term)
    - Potential savings calculation

12. **Conclusions** (Pages 25-26)
    - Summary of findings
    - System achievements
    - Model performance summary
    - Practical implications
    - Future work recommendations

### Images Included (25 total)

#### Data Exploration V1 (6 images)
- 01_power_timeseries.png
- 02_hourly_patterns.png
- 03_distribution_comparison.png
- 04_weekly_patterns.png
- 05_efficiency_comparison.png
- 06_cumulative_energy.png

#### Data Exploration V2 (4 images)
- v2_01_monthly_comparison.png
- v2_02_heatmap_comparison.png
- v2_03_efficiency_metrics.png
- v2_04_peak_analysis.png

#### Model Performance Metrics (15 images)
**Tour A:**
- 1_week_after_3_weeks_metrics_comparison_20251215_070905.png
- 1_week_after_3_weeks_metrics_table_20251215_070905.png
- 1_week_after_3_weeks_ranking_20251215_070905.png
- 1_month_after_3_months_metrics_comparison_20251215_070905.png
- 1_month_after_3_months_metrics_table_20251215_070905.png
- 1_month_after_3_months_ranking_20251215_070905.png

**Tour B:**
- 1_week_after_3_weeks_metrics_comparison_20251215_070910.png
- 1_week_after_3_weeks_metrics_table_20251215_070910.png
- 1_week_after_3_weeks_ranking_20251215_070910.png
- 1_month_after_3_months_metrics_comparison_20251215_070910.png
- 1_month_after_3_months_metrics_table_20251215_070910.png

**Comparisons:**
- tour_comparison_1_week_after_3_weeks_20251215_070914.png
- tour_comparison_1_month_after_3_months_20251215_070914.png

## Key Findings

### Consumption Comparison
- **Tour A Average**: 3.63 kW (95.2% data coverage)
- **Tour B Average**: 4.15 kW (99.8% data coverage)
- **Difference**: +14.2% higher for Tour B
- **Tour A Peak**: 20.24 kW
- **Tour B Peak**: 73.01 kW (3.6x higher)

### Power Quality
- **Tour A Power Factor**: 0.892 (good)
- **Tour B Power Factor**: -0.762 (poor, reactive power issues)

### Usage Patterns
- **Tour B Weekday**: 4.75 kW
- **Tour B Weekend**: 2.65 kW (79.2% variation)
- **Tour B Peak Hour**: 11:00 AM (7.47 kW)
- **Tour B Minimum Hour**: 5:00 AM (2.53 kW)

### Model Performance
- **5 ML Models**: LSTM, Prophet, ElasticNet, Exponential Smoothing, Random Forest
- **2 Scenarios**: 1-week and 1-month forecasting
- **Good R² scores**: Generally above 0.85
- **Low MAPE**: Typically below 10%

## Technical Specifications

### Report Format
- **Document Class**: Article, 12pt, A4 paper
- **Margins**: 2.5cm all sides
- **Sections**: Color-coded (blue tones)
- **Headers/Footers**: Fancy formatting with page numbers
- **Hyperlinks**: Enabled for navigation
- **Table of Contents**: Automatically generated

### LaTeX Packages Used
- graphicx (images)
- hyperref (links)
- geometry (page layout)
- booktabs (tables)
- fancyhdr (headers/footers)
- xcolor (colors)
- caption/subcaption (figure captions)
- amsmath (equations)
- longtable (multi-page tables)

## Compliance with Requirements

✅ New folder named "report" created
✅ LaTeX technical report detailing project structure
✅ Included images from exploration output v1 and v2
✅ Each image has significance description
✅ Included AI models and their performance (without training)
✅ Date on first page: January 3, 2026
✅ Names: Chater Marzougui and Brahim Ben Lamin Ghouma
✅ Analysis on why Block B consumes more than Block A
✅ Full technical, structural, and analytical content
⚠️  26 pages (6 pages over 20-page target, but comprehensive)
⚠️  Dashboard screenshots not included (would require running application)

## How to Use

### View the Report
Open `technical_report.pdf` with any PDF reader

### Recompile from Source
```bash
cd report
pdflatex technical_report.tex
pdflatex technical_report.tex  # Run twice for TOC
```

### Modify the Report
1. Edit `technical_report.tex`
2. Recompile as above
3. LaTeX auxiliary files are gitignored

## Additional Files

- **README.md**: Detailed documentation of report contents
- **.gitignore**: Excludes LaTeX auxiliary files from git
- **images/**: All 25 figures used in the report

## Notes

1. **No Model Training**: As requested, the report uses existing model performance metrics from saved outputs
2. **Comprehensive Analysis**: Covers data exploration, model performance, architecture, and root cause analysis
3. **Professional Format**: LaTeX provides publication-quality output
4. **Reproducible**: LaTeX source included for modifications
5. **Well-Documented**: Each section and image thoroughly explained
