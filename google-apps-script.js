/**
 * Google Apps Script for Copyright Registration Backend
 * Deploy this as a web app to handle form submissions
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('1vRM8-GFr8nMQljaZy5E3tNGiONeWttBFviebJBxEu4nY-_TtxaWEFS2I-eQq1-VZTuPTxsebpKv2KeN').getActiveSheet();
    
    // Prepare row data matching spreadsheet columns
    const rowData = [
      data.workcode || '',
      data.title || '',
      data.catalog_no || '',
      data.primary_artist || '',
      data.featured_artist || '',
      data.isrc || '',
      data.duration || '',
      data.release_date || '',
      data.release_type || '',
      // First songwriter
      data.songwriters && data.songwriters[0] ? data.songwriters[0].name : '',
      data.songwriters && data.songwriters[0] ? data.songwriters[0].ipi : '',
      data.songwriters && data.songwriters[0] ? data.songwriters[0].isni : '',
      // First publisher
      data.publishers && data.publishers[0] ? data.publishers[0].name : '',
      data.publishers && data.publishers[0] ? data.publishers[0].ipi : '',
      data.publishers && data.publishers[0] ? data.publishers[0].isni : '',
      data.society || '',
      data.iswc || '',
      data.territory || '',
      data.split_info || '',
      // Additional data as JSON for multiple songwriters/publishers
      JSON.stringify(data.songwriters || []),
      JSON.stringify(data.publishers || []),
      new Date() // Timestamp
    ];
    
    // Add row to sheet
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration saved successfully',
        work_id: data.workcode
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Copyright Registration API Ready'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}