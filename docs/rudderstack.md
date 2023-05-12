# RudderStack

Rudderstack is a comprehensive customer data infrastructure platform that simplifies the process of collecting, processing, and routing data from various sources to multiple destinations. It offers a range of powerful APIs and tools to help businesses effectively manage their customer data and make informed decisions.

## When to use RudderStack

We currently use Rudderstack to track the onboarding process and major feature usages.

## How to name events

Currently we are using the following naming convention for events:

`trackEvent('[component name, action]', { additional properties })`

Some examples:

```
trackEvent('Search Options, search for an influencer')
trackEvent('Already Added Modal - click do not add');
```

If there is additional properties you want to add to the event, you can do so by passing an object as the second argument:

```
trackEvent('Search Options, search for an influencer', {
  influencerId: 123,
  influencerName: 'John Doe'
});
```
