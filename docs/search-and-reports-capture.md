## Search & Reports Capture

## What is a Journey?

A Journey is a way to track what our users are doing within a certain context. We currently have one journey called `search`.
We start the search journey once the dashboard/discover page is loaded. All tracked actions will now be a part of that journey.
Using the Journey, we can lookup the user and group all the events by journey and identify what are the actions done.

## Search Results & Unique Search Parameters

We capture the search results and unique search parameters by doing the following:

1. The user does a search on our frontend
2. The backend will proxy the search request to iqdata and retrieve the results
3. A search snapshot and unique search parameter will be created
4. ID's will be appended to the results in `__metadata` which includes the "future" event id
5. Frontend caches the response and sends an API call to record an event passing the id's from the response
6. Backend will receive the "future" event_id and snapshot_id which will be used to either create a copy or update the snapshot

## Why pass around the IDs?

Every search should be registered as a unique event+snapshot.
The keys are passed around so we will be able to duplicate the snapshot.

## Other events

Other events are tracked normally without workarounds.
You can find the events in `/src/utils/analytics/events/index.ts`

# ULID, UUID, nanoid

We cannot use ULID on postgres. There might be work arounds but I rather stick to UUID.
The only benefit for ULID is the sortability which we rarely use in ids as far as I know.

Nanoid is for unique strings similar but is way shorter, recognizable and faster.

UUID for generating RFC compliant id strings
Nanoid for generating unique random strings
