# Google Sheets Backend Setup - Updated

## Spreadsheet Column Headers

Add these exact headers to Row 1 of your Google Sheet:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Workcode | Title | Catalog No | Primary Artist | Featured Artist | ISRC | Duration | Release Date | Release Type | Songwriter | Songwriter IPI | Songwriter ISNI | Publisher Name | Publisher IPI | Publisher ISNI | Society | ISWC | Territory | Split Info | All Songwriters | All Publishers | Timestamp |

## Setup Steps

1. **Create Google Apps Script:**
   - Go to [script.google.com](https://script.google.com)
   - Create new project
   - Replace code with `google-apps-script.js` content
   - Save project

2. **Deploy Web App:**
   - Click Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Access: Anyone
   - Deploy and copy URL

3. **Update Form:**
   - Replace `YOUR_SCRIPT_ID` in `index.html` with your script ID
   - Script ID is in the URL: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

4. **Test:**
   - Submit form entry
   - Verify data appears in spreadsheet

## Form Features

- **Auto Work Code Generation** - Unique identifier for each work
- **Multiple Songwriters** - Plus button to add more
- **Multiple Publishers** - Plus button to add more  
- **Territory Selection** - Multi-select dropdown
- **Complete Data Capture** - All required copyright fields
- **JSON Backup** - Full songwriter/publisher data in columns T & U

## Data Flow

Form → Google Apps Script → Google Sheets

The first songwriter/publisher appears in individual columns, with complete arrays stored as JSON for reference.