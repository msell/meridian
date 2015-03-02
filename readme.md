data migration utility for arcade karaoke

node ./scrapeSongbook.js

connect to mongodb and run the mongo shell script to add the song count

```
mongo ds041841.mongolab.com:41841/arcade -u <dbuser> -p <dbpassword>

load("addCount.js");
```