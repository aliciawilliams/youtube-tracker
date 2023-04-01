# Tracking YouTube video views and comments
This solution uses Google Sheets and [Apps Script](https://developers.google.com/apps-script/overview) to create a spreadsheet tracker for performance of selected public YouTube videos. The spreadsheet reads user-provided YouTube links and uses the [YouTube Advanced Service](https://developers.google.com/apps-script/advanced/youtube) to source views, likes, and comment counts for each video. The data updates are triggered to run on a regular basis, and an email notification is sent for any videos that have increased comment counts.

More info available in [this blog post](https://medium.com/@presactlyalicia/automating-youtube-comment-notifications-using-google-sheets-d5c09aa7f636).


# Setup
## Spreadsheet setup
1. Make of copy of the spreadsheet [here](https://docs.google.com/spreadsheets/d/1GmtwCchbubqBqjUNQN9QB8ni0v5h-CtPczT--4l1J2w/copy). It already contains the Apps Script code from this repository.
2. Change the name of the tab to the full email address where you’d like to receive email notifications. 
3. Locate URLs of videos you would like to track and add them in column A below cell A1. URLs must be in the format starting with: 
* https://www.youtube.com/watch?v=  
* https://www.youtu.be/ 
* https://www.youtube.com/shorts/

## YouTube Advanced Service setup
1. From the spreadsheet, open the script editor by selecting Tools > Script editor.
2. In the left-hand navigation pane, select + next to Services.
3. Choose the YouTube Data API service, and click Add.

## Test the code
1. From the script editor, choose `markVideos` from the drop-down box in the toolbar, then click ▶ Run.
2. You should see the details added in columns C through H, and you will receive an email for any videos that have more than zero comments. When running the function in the future, you will only receive an email with videos whose comment count has increased since the last time the script was run.
3. Optionally, to turn off email notifications, change line 2 of `code.gs` from `'Y'` to `'N'`.

## Apps Script trigger setup 
Instead of running the script manually, set it up to run at regular intervals (such as once a day).
1. From the script editor, navigate to the left-hand vertical toolbar, and choose Triggers.
2. In the bottom right-hand corner, click the +Add Trigger button.
3. Under Run, select the `markVideos` function.
4. Under Select event source, choose Time-driven.
5. Under type, select Day timer.
6. Then select time of day, such as 6am to 7am.
7. Optionally, adjust the Failure notification settings to configure how and when you are contacted by email if your triggered function fails.
7. Click Save.

# Appendix
Let me know if you run into any problems!

NOTE: This is not an official Google product.
