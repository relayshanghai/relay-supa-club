import { describe, it, expect } from 'vitest';

import { getScheduledMessages } from './webhook';
import outboxMock from '../../../src/mocks/email-engine/outbox';
import type { OutboxGet } from 'types/email-engine/outbox-get';
import sequenceEmails from '../../../src/mocks/supabase/sequence_emails/four-sequence-emails';

describe('webhook helpers - getScheduledMessages', () => {
    // Really this is just a simple filter function, but just as a sanity check:
    it('should pick out the messages in the outbox that match the sequence emails message ids', () => {
        // false positive test
        const resultWithoutMatching = getScheduledMessages(outboxMock.messages, sequenceEmails);
        expect(resultWithoutMatching).toEqual([]);
        const outboxWithMatching: OutboxGet = {
            ...outboxMock,
        };

        // put some matching message ids in the outbox
        outboxWithMatching.messages[0].messageId = sequenceEmails[0].email_message_id ?? '';
        outboxWithMatching.messages[1].messageId = sequenceEmails[0].email_message_id ?? '';
        const resultMatching = getScheduledMessages(outboxWithMatching.messages, sequenceEmails);
        expect(resultMatching).toEqual([outboxWithMatching.messages[0], outboxWithMatching.messages[1]]);
    });
});
