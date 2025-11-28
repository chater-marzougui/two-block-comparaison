import os
import pandas as pd

printed = False
print_only_first_n = 5

def get_csv_files(data_dir):
    """
    Dynamically find all CSV files in the data directory structure.
    
    Args:
        data_dir: Path to the SINERT_DATA_CONCENTRATOR directory
        
    Returns:
        List of paths to all CSV files
    """
    csv_files = []
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith('.csv') or file.endswith('.xlsx'):
                csv_files.append(os.path.join(root, file))
    return sorted(csv_files)

def debug_bad_timestamp_rows(data_dir, max_rows_per_file=5):
    """
    Walk through all CSVs in data_dir, try to parse Date+Time, and
    print rows where the resulting datetime is NaT (invalid).
    """
    global printed
    csv_files = get_csv_files(data_dir)
    print(f"Scanning {len(csv_files)} CSV files for bad Date/Time rows...\n")
    
    for file_path in csv_files:
        try:
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path, sep=';', low_memory=False)
            elif file_path.endswith('.xlsx'):
                df = pd.read_excel(file_path)
                # convert Date column from yyyy-mm-dd hh:mm:ss to dd-mm-yyyy
                if 'Date' in df.columns:
                    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%d-%m-%Y')
            else:
                print(f"❌ Unsupported file type: {file_path}")
                continue
        except Exception as e:
            print(f"❌ Could not read {file_path}: {e}")
            continue
        
        
        mask = ~(df['Time'] == '24:00:00')
        df = df[mask]
        
        # Skip files that don't have Date & Time columns
        if 'Date' not in df.columns or 'Time' not in df.columns:
            print(f"⚠ Skipping {file_path}: missing Date or Time column")
            if not printed:
                printed = True
                print(df.columns[:print_only_first_n])
            continue

        # Try to parse datetime like you do in load_single_csv
        dt = pd.to_datetime(
            df['Date'].astype(str) + ' ' + df['Time'].astype(str),
            format='%d-%m-%Y %H:%M:%S',
            errors='coerce'
        )

        bad_mask = dt.isna()
        if not bad_mask.any():
            continue  # this file is clean

        bad_indices = df[bad_mask].index
        print(f"\n==============================")
        print(f"⚠ Bad Date/Time rows in file:\n{file_path}")
        print(f"Total bad rows: {len(bad_indices)}")
        print("==============================")

        for i, idx in enumerate(bad_indices):
            row = df.loc[idx]

            # Basic info
            date_val = row.get('Date', None)
            time_val = row.get('Time', None)

            print(f"- Row {idx}: Date={repr(date_val)}, Time={repr(time_val)}")

            # Show a few extra columns to see what the line actually is
            extra = row.drop(labels=[c for c in ['Date', 'Time'] if c in row.index])
            extra_preview = extra.iloc[:5] if hasattr(extra, "iloc") else extra
            print(f"  First 5 other values: {list(extra_preview.values)}")

            if i + 1 >= max_rows_per_file:
                remaining = len(bad_indices) - max_rows_per_file
                if remaining > 0:
                    print(f"  ... and {remaining} more bad rows in this file")
                break

if __name__ == "__main__":
    data_directory = "./SINERT_DATA_CONCENTRATOR"  # Adjust as needed
    debug_bad_timestamp_rows(data_directory)