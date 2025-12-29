/**
 * Google Apps Script for Music Engine Registration Form
 * Deploy this as a web app and use the URL in the React Native app
 */

function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Open the Google Sheet by ID (extract from your URL)
    const SHEET_ID = '1vRM8-GFr8nMQljaZy5E3tNGiONeWttBFviebJBxEu4n'; // Extract from your URL
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Prepare row data matching your spreadsheet columns
    const rowData = [
      new Date(), // Timestamp
      data.workcode || '',
      data.title || '',
      data.catalog_no || '',
      data.primary_artist || '',
      data.featured_artist || '',
      data.isrc || '',
      data.duration || '',
      data.release_date || '',
      data.release_type || '',
      data.iswc || '',
      data.society || '',
      data.recording_location || '',
      data.key || '',
      data.bpm || '',
      data.language || '',
      data.lyrics || '',
      data.ai_generated ? 'Yes' : 'No',
      data.contains_samples ? 'Yes' : 'No',
      
      // Songwriters (flatten array to string)
      data.songwriters ? data.songwriters.map(s => `${s.name} (${s.split}%)`).join(', ') : '',
      
      // Publishers (flatten array to string)
      data.publishers ? data.publishers.map(p => `${p.name} (${p.split}%) - ${p.territory}`).join(', ') : '',
      
      // Administrators (flatten array to string)
      data.administrators ? data.administrators.map(a => `${a.name} (${a.split}%) - ${a.territory}`).join(', ') : '',
      
      // Producers (flatten array to string)
      data.producers ? data.producers.map(p => `${p.name} - ${p.role}`).join(', ') : '',
      
      data.music_file || '',
      data.artwork_file || ''
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Music Engine Registration API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Deploy as web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL
 * 6. Replace the URL in RegisterScreen.js
 */