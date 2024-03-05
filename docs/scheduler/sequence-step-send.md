Sequence send flow.

- User click Send Sequence
- hits `pages/api/sequence/send.ts` endpoint
  - creates a job in the `jobs` table for each influencer for sending the outreach email
- supabase cron workers call the `jobs/run` endpoint which calls `getJobs` once a minute, which pulls jobs in a queue from the `jobs` table. then calls which in this case runs `/sequence-step-send`
  - if outreach email, schedules all 4 emails and saves the expected delivery dates to all four emails `sequence_emails` rows in our database
    - When scheduling, it looks at our database email records and makes sure not to send more than `17` emails of the same step per day. (`schedule-emails.ts`)
    - sends outreach email to email engine. Gets back `messageId` and saves it to the `sequence_email` and updates `email_delivery_status` to `scheduled`
  - Job is marked `success` (successfully sent to email engine, but not yet sent out)
  - Hangs out in email engine Outbox (delayed),
    - Will send on next business day if was scheduled for next business day (queue was not full)
    - otherwise could spend quite a long time in there waiting for other outreach emails to send
- On web hook `handleSent`, when successfully sent outreach, will grab the next sequence step `email` record from our database, and send an email with Email Engines
  - it hangs out in the outbox for 3-3 days (depending on day of week)
- Same thing happens again for other follow up emails.
