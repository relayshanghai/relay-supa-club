### Background

Because we were getting a lot of analytics events not going through, we decided to run them all through the schedululer to make sure that the rudderstack/mixpanel srver was not getting overloaded.

### How it works

The scheduler is a simple cron job that runs every minute. It checks the database for any analytics events that have not been sent and sends them to the rudderstack/mixpanel server.
