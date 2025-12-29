# Google Sheets Integration Setup

## Step 1: Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project (name it "Music Engine API")

## Step 2: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click "Deploy"
5. Copy the Web App URL (looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 3: Update React Native App

1. Open `src/screens/RegisterScreen.js`
2. Find line 33: `const response = await fetch('https://script.google.com/macros/s/AKfycbxYOUR_SCRIPT_ID/exec'`
3. Replace `AKfycbxYOUR_SCRIPT_ID` with your actual script ID from the Web App URL

## Step 4: Prepare Google Sheet

Your spreadsheet should have these columns (in order):
1. Timestamp
2. Work Code
3. Title
4. Catalog No
5. Primary Artist
6. Featured Artist
7. ISRC
8. Duration
9. Release Date
10. Release Type
11. ISWC
12. Society
13. Recording Location
14. Key
15. BPM
16. Language
17. Lyrics
18. AI Generated
19. Contains Samples
20. Songwriters
21. Publishers
22. Administrators
23. Producers
24. Music File
25. Artwork File

## Step 5: Test the Integration

1. Run your React Native app
2. Fill out the registration form
3. Submit the form
4. Check your Google Sheet for the new row

## Troubleshooting

- Make sure the Google Apps Script is deployed with "Anyone" access
- Verify the Sheet ID in the script matches your spreadsheet
- Check browser console for any CORS errors
- Ensure all required form fields are filled