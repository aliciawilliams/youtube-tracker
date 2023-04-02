// Sets preferences for email notification. Choose 'Y' to send emails, 'N' to skip emails.
var EMAIL_ON = 'Y';

// Matches column names in Video sheet to variables.
var COLUMN_NAME = {
  VIDEO: 'Video Link',
  TITLE: 'Video Title',
};

/**
 * Obtains YouTube video details and statistics for all
 * video URLs listed in 'Video Link' column in each
 * sheet. Sends email summary, based on preferences above, 
 * when videos have new comments or replies.
 */
function markVideos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  
  // Runs through process for each tab in Spreadsheet.
  sheets.forEach(function(dataSheet) {
    var tabName = dataSheet.getName();
    var range = dataSheet.getDataRange();
    var numRows = range.getNumRows();
    var rows = range.getValues();
    var headerRow = rows[0];
    
    // Finds the column indices.
    var videoColumnIdx = headerRow.indexOf(COLUMN_NAME.VIDEO);
    var titleColumnIdx = headerRow.indexOf(COLUMN_NAME.TITLE);
    
    // Creates empty array to collect data for email table.
    var emailContent = [];
    
    // Processes each row in spreadsheet.
    for (var i = 1; i < numRows; ++i) {
      var row = rows[i];
      // Extracts video ID.
      var videoId = extractVideoIdFromUrl(row[videoColumnIdx])
      // Processes each row that contains a video ID.
      if(!videoId) { 
        continue;
      }
      // Calls getVideoDetails function and extracts target data for the video.
      var detailsResponse = getVideoDetails(videoId);
      if(detailsResponse.pageInfo.totalResults==0) {
        continue; // skip to next row
      }
      var title = detailsResponse.items[0].snippet.title;
      var publishDate = detailsResponse.items[0].snippet.publishedAt;
      var publishDateFormatted = new Date(publishDate);
      var views = detailsResponse.items[0].statistics.viewCount;
      var likes = detailsResponse.items[0].statistics.likeCount;
      var comments = detailsResponse.items[0].statistics.commentCount;
      var channel = detailsResponse.items[0].snippet.channelTitle;
      
      // Collects title, publish date, channel, views, comments, likes details and pastes into tab.
      var detailsRow = [title,publishDateFormatted,channel,views,comments,likes];
      dataSheet.getRange(i+1,titleColumnIdx+1,1,6).setValues([detailsRow]);
      
      // Determines if new count of comments/replies is greater than old count of comments/replies.
      var addlCommentCount = comments - row[titleColumnIdx+4];
      
      // Adds video title, link, and additional comment count to table if new counts > old counts.
      if (addlCommentCount > 0) {
        var emailRow = [title,row[videoColumnIdx],addlCommentCount]
        emailContent.push(emailRow);
      }
    }
    // Sends notification email if Content is not empty.
    if (emailContent.length > 0 && EMAIL_ON == 'Y') {
      sendEmailNotificationTemplate(emailContent, tabName);
    }
  });
}
                 
/**
 * Obtains video details for YouTube videos
 * using YouTube Data API advanced service.
 */
function getVideoDetails(videoId) {
  var part = "snippet,statistics";
  var response = YouTube.Videos.list(part,
      {'id': videoId});
 return response;
}

/**
 * Extracts YouTube video ID from url.
 */
function extractVideoIdFromUrl(url) {
  var regExp = '(?:v=|be/|shorts/)([a-zA-Z0-9_-]+)';
  var videoId = url.match(regExp)[1];
 return videoId;
}

/**
 * Assembles notification email with table of video details. 
 * (h/t https://stackoverflow.com/questions/37863392/making-table-in-google-apps-script-from-array)
 */
function sendEmailNotificationTemplate(content, emailAddress) {
  var template = HtmlService.createTemplateFromFile('email');
  template.content = content;
  var msg = template.evaluate();  
  MailApp.sendEmail(emailAddress,'New comments or replies on YouTube',msg.getContent(),{htmlBody:msg.getContent()});
}
