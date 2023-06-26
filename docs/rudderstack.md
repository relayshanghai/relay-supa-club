# RudderStack

Rudderstack is a comprehensive customer data infrastructure platform that simplifies the process of collecting, processing, and routing data from various sources to multiple destinations. It offers a range of powerful APIs and tools to help businesses effectively manage their customer data and make informed decisions.

## When to use RudderStack

We currently use Rudderstack to track the onboarding process and major feature usages.

## Get started

1. go to rudderstack.com and use the Login credentials from BitWarden or ask the team.
2. Once logged in, you can see all the current connections form the 'Connect' tab

### Setup

-   Choose a test source, "Test-App-Frontend" or "Test backend" and click on it. So we do not send our test events to the production destinations.
-   Click on the 'Setup' tab and copy the WriteKey and Data Plane URL to your local .env

```
# Rudderstack

NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY=""
NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL="https://xxxxxxxxx.dataplane.rudderstack.com"
```

### How to test frontend events

1. Add trackEvent calls to the place you want to track the event. See the section below for naming conventions.
2. Open the Source you are testing, and click on the 'Live Events' button in the top right corner
3. Mock the event in your local app and check if it appears in the Live Events tab
4. In our current Rudderstack plan, the events have delays, it could take up to 1 minute for the event to show up in the live event session, so be patient.
5. Once you see the event appears, you can check the payload and see if it is correct.

## How to name events

Currently we are using the following naming convention for events:

`trackEvent('[component name, action]', { additional properties })`

Some examples:

```
trackEvent('Search Options, search for an influencer')
trackEvent('Already Added Modal, click do not add');
```

If there is additional properties you want to add to the event, you can do so by passing an object as the second argument:

```
trackEvent('Search Options, search for an influencer', {
  influencerId: 123,
  influencerName: 'John Doe'
});
```
