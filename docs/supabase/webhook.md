## Database Webhook

Database Webhooks allow you to send real-time data from your database to another system whenever a table event occurs. See more [here](https://supabase.com/docs/guides/database/webhooks).

To create a new database webhook:

1. Create an api handler for the webhook endpoint. See `api/slack/create.ts` for example.
2. go to Supabase Dashboard > Database > Webhooks. Click on `create a new webhook` button on the top right.
3. Fill in the form.
    - `Name` is to name this webhook.
    - `Table` is the table that you want to listen to.
    - `Events` is the data actions that will trigger this webhook. You can select multiple events.
    - `Type of hook` should be default `HTTP Request`.
    - `Method` should be `POST`.
    - `URL` is the endpoint that will receive the webhook payload.
        - In our example it should be `http://app.relay.club/api/slack/create` for production. And your branch's vercel preview url for staging.
        - You can use tool like [RequestBin](https://requestbin.com/) to generate an endpoint to test the webhook first. And use that test endpoint here when testing. As Supabase now does not seem to provide a way to see the request payload in live.
        - Also, for now there is no way to edit URL after it is created. So you will need to delete and recreate the webhook if you want to change the URL.
    - `HTTP Headers` & `HTTP Params` use as needed. As in the slack integration, we added the slack token in the `HTTP Params`.
4. Click `Create webhook` button.

---
