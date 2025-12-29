/**
 * Google Apps Script for Copyright Registration Backend
 * Deploy this as a web app to handle form submissions
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('1vRM8-GFr8nMQljaZy5E3tNGiONeWttBFviebJBxEu4nY-_TtxaWEFS2I-eQq1-VZTuPTxsebpKv2KeN').getActiveSheet();
    
    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      data.title || '',
      data.work_type || '',
      data.iswc || '',
      data.isrc || '',
      data.duration || '',
      data.description || '',
      (data.territories || []).join(', '),
      data.primary_artist || '',
      (data.featured_artists || []).join(', '),
      data.label_name || '',
      // First writer
      data.writers && data.writers[0] ? data.writers[0].name : '',
      data.writers && data.writers[0] ? data.writers[0].ipi : '',
      data.writers && data.writers[0] ? data.writers[0].isni : '',
      data.writers && data.writers[0] ? data.writers[0].share : '',
      data.writers && data.writers[0] ? data.writers[0].role : '',
      // First publisher
      data.publishers && data.publishers[0] ? data.publishers[0].name : '',
      data.publishers && data.publishers[0] ? data.publishers[0].ipi : '',
      data.publishers && data.publishers[0] ? data.publishers[0].isni : '',
      data.publishers && data.publishers[0] ? data.publishers[0].share : '',
      // Files
      data.files ? data.files.audio : '',
      data.files ? data.files.artwork : '',
      data.files ? data.files.lyrics : '',
      // Additional data as JSON
      JSON.stringify(data.writers || []),
      JSON.stringify(data.publishers || [])
    ];
    
    // Add row to sheet
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        work_id: 'WRK_' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
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
      message: 'Copyright Registration API'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}