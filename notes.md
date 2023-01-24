## What date format to storei in firestore

### objective

1. easy to calculate tomorrow, yesterday, etc => will use dayjs
2. be able to read in firestore (unix timestamp are not human readable)
3. easy to do the cron job etc

### option

1. store in isoString format in UTC timezone => convert to dayjs when use in a program
