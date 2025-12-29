# Google Sheets Backend Setup

## Step 1: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project

## Step 2: Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Choose type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the Web App URL

## Step 3: Update Form

1. Replace `YOUR_SCRIPT_ID` in `index.html` with your actual script ID from the URL
2. The URL format is: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

## Step 4: Setup Spreadsheet Headers

Add these headers to your Google Sheet (Row 1):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Title | Work Type | ISWC | ISRC | Duration | Description | Territories | Primary Artist | Featured Artists | Label | Writer Name | Writer IPI | Writer ISNI | Writer Share | Writer Role | Publisher Name | Publisher IPI | Publisher ISNI | Publisher Share | Audio File | Artwork | Lyrics | All Writers | All Publishers |

## Step 5: Test

Submit a form entry to verify data appears in your spreadsheet.

## Data Structure

The form will send:
- Basic work information
- Territory selections
- Artist details
- First writer/publisher in individual columns
- All writers/publishers as JSON in the last columns
- File upload names

## Security Note

The Google Apps Script runs with your permissions and can access your Google Drive. Only deploy if you trust the code.