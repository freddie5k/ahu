# Excel Import Script - One-Time Data Import

This script will import your Excel data into the Supabase opportunities table.

## Prerequisites

1. **Python 3.8+** installed
2. **Your Supabase Anon Key** (you mentioned you have it)
3. **Your Excel file** with the opportunity data

## Step-by-Step Instructions

### 1. Install Python Dependencies

```bash
cd /home/user/ahu/scripts
pip install -r requirements.txt
```

### 2. Set Your Supabase Anon Key

```bash
export SUPABASE_ANON_KEY='your-anon-key-here'
```

Replace `your-anon-key-here` with your actual Supabase anon key.

### 3. Run the Import Script

```bash
python import_excel.py /path/to/your/excel/file.xlsx
```

For example:
```bash
python import_excel.py ~/Downloads/opportunities.xlsx
```

## What the Script Does

1. ✅ Reads your Excel file
2. ✅ Maps Excel columns to database columns
3. ✅ Converts currency values (removes € symbols, etc.)
4. ✅ Converts dates to proper format
5. ✅ Sets price_eur to match Selling Price
6. ✅ Inserts all rows into Supabase
7. ✅ Shows progress and summary

## Column Mapping

| Excel Column | Database Column |
|--------------|----------------|
| Project Name | title |
| BU | bu |
| Site | site |
| Owner | owner_name |
| Status | status |
| Priority | priority |
| Closing date | target_close_date |
| Description | description |
| Air flow (m3/h) | air_flow_m3h |
| Number of Units | number_of_units |
| DSS / DSP desing | dss_dsp_design |
| Transfer cost without OH and profit 8% /u | transfer_cost_without_oh_profit_8_per_u |
| Transfer cost complete /u | transfer_cost_complete_per_u |
| Vortice price | vortice_price |
| Selling Price | selling_price (also sets price_eur) |
| Comments | comments |

## Troubleshooting

**Error: SUPABASE_ANON_KEY not set**
- Make sure you've exported the environment variable with your anon key

**Error: File not found**
- Check the path to your Excel file is correct
- Use absolute path if relative path doesn't work

**Error: Permission denied**
- Make sure the script is executable: `chmod +x import_excel.py`

## After Import

Once the import is complete:
1. Check your Supabase dashboard to verify the data
2. Refresh your web app to see the imported opportunities
3. You can delete this script folder if you want (it was only for one-time use)
