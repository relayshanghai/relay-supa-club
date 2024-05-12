import { useThread, useThreadReply } from 'src/hooks/v2/use-thread';
import ThreadHeader from './thread-header';
import { useMessages } from 'src/hooks/v2/use-message';
import ThreadMessageList from './thread-message-list/thread-message-list';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ThreadReply from './thread-message-reply/thread-reply';
import type { Email, EmailAttachment, EmailContact } from 'src/backend/database/thread/email-entity';
import { serverLogger } from 'src/utils/logger-server';
import { nanoid } from 'nanoid';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { type Paginated } from 'types/pagination';

/**
 * Generate local Message object with isLocal attribute
 */
const generateLocalData = (params: {
    body: string;
    from: EmailContact;
    to: EmailContact[];
    cc: EmailContact[];
    subject: string;
    attachments: EmailAttachment[];
}): Email => {
    const localId = nanoid(10);
    return {
        date: new Date(),
        unseen: false,
        id: localId,
        from: params.from,
        to: params.to,
        cc: params.cc,
        attachments: params.attachments,
        replyTo: params.to,
        subject: params.subject,
        text: {
            html: params.body,
        },
    } as Email;
};

export default function ThreadMessages() {
    const { profile } = useUser();
    const { company } = useCompany();
    const myEmail = profile?.email || '';
    const { selectedThread, loading } = useThread();
    console.log('selectedThread', selectedThread);

    // const { messages, mutate } = useMessages(selectedThread?.threadId as string);
    const { messages, mutate } = {
        messages: {
            items: [
                {
                    path: '[Gmail]/All Mail',
                    specialUse: '\\All',
                    id: 'AAAAAQAAAI0',
                    uid: 141,
                    emailId: '1797204510139158552',
                    threadId: '1797204510139158552',
                    date: '2024-04-24T18:36:00.000Z',
                    flags: ['\\Seen'],
                    labels: ['\\Sent'],
                    size: 5635,
                    subject: 'Outreach',
                    from: {
                        name: 'Ilham Fadhilah',
                        address: 'ilham@boostbot.ai',
                    },
                    replyTo: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'ilham@boostbot.ai',
                        },
                    ],
                    sender: {
                        name: 'Ilham Fadhilah',
                        address: 'ilham@boostbot.ai',
                    },
                    to: [
                        {
                            name: 'KamiYozora',
                            address: 'fadhilahilham.27+1@gmail.com',
                        },
                    ],
                    messageId: '<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com>',
                    headers: {
                        'return-path': ['<ilham@boostbot.ai>'],
                        received: [
                            'from localhost ([118.99.72.240]) by smtp.gmail.com with ESMTPSA id gd2-20020a056a00830200b006edda81101esm10846538pfb.80.2024.04.24.01.36.21 for <fadhilahilham.27+1@gmail.com> (version=TLS1_3 cipher=TLS_AES_256_GCM_SHA384 bits=256/256); Wed, 24 Apr 2024 01:36:22 -0700 (PDT)',
                        ],
                        'content-type': ['multipart/alternative; boundary="--_NmP-6b28cd50bafe2bee-Part_1"'],
                        'x-ee-sid': ['g6FuxASxTINjoXTPAAABjw8_WKmhbMQMIMzBCqsjUmPgQGyA'],
                        from: ['Ilham Fadhilah <ilham@boostbot.ai>'],
                        to: ['KamiYozora <fadhilahilham.27+1@gmail.com>'],
                        subject: ['Outreach'],
                        'message-id': ['<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com>'],
                        date: ['Wed, 24 Apr 2024 18:36:00 +0000'],
                        'mime-version': ['1.0'],
                    },
                    text: {
                        id: 'AAAAAQAAAI2TkaExkaEykA',
                        plain: 'Hey KamiYozora,\nBotaski here from Botacorp. I just saw your "Among Us Game Night #1" post, and I gotta say, love your content style 🤩.\n\nWe\'d love to work together with you on a Botacorp collab! Have a feeling Botasight is something your audience would be really into!\n\nBotacorp is a product for finding you a nice products\n\nWe’re looking to partner with 8 or so influencers to get the word out about Botasight over the next couple weeks, and would love for you to be apart of it.\nLet me know if this is something you\'d be interested in!\n\nCheers,\n\nBotaski at Botacorp',
                        html: '<!--[if !gte mso 9]><!---->\n<div style="\n    display:none !important;\n    max-height: 0px;\n    max-width: 1px;\n    font-size: 1px;\n    line-height: 1px;\n    opacity: 0.0;\n    mso-hide: all;\n    overflow: hidden !important;\n    visibility: hidden !important;\n">Outreach &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; </div>\n<!--<![endif]-->\n<p>Hey KamiYozora,</p>\n<p>Botaski here from Botacorp. I just saw your <a href="http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc">"Among Us Game Night #1"</a> post, and I gotta say, love your content style 🤩.</p> \n<br>    \n<p>We\'d love to work together with you on a Botacorp collab! Have a feeling <a href="botacorp.com/botasight">Botasight</a> is something your audience would be really into!</p>\n<br>\n<p>Botacorp is a product for finding you a nice products</p>\n<br>\n<p>We’re looking to partner with 8 or so influencers to get the word out about Botasight over the next couple weeks, and would love for you to be apart of it.</p>\n<p>Let me know if this is something you\'d be interested in!</p>\n<br>\n<p>Cheers,</p>\n<br>\n<p>Botaski at Botacorp</p><img src="http://localhost:4000/open.gif?data=eyJhY3QiOiJvcGVuIiwiYWNjIjoiaWxoYW1AYm9vc3Rib3QuYWkiLCJtc2ciOiI8NmE2YjY0NjAtZTY0Mi00NmEyLTg4OWMtODNjMDk3NWE0MGU4QGdtYWlsLmNvbT4ifQ&sig=fN9t4iDpD2UD92Ukt164lfAywQXuqd0B9Z69fiyal2M" style="border: 0px; width:1px; height: 1px;" tabindex="-1" width="1" height="1" alt="">\n',
                        encodedSize: {
                            plain: 609,
                            html: 4016,
                        },
                        hasMore: false,
                    },
                    messageSpecialUse: '\\Sent',
                },
                {
                    path: '[Gmail]/All Mail',
                    specialUse: '\\All',
                    id: 'AAAAAQAAAJA',
                    uid: 144,
                    emailId: '1797204945452469585',
                    threadId: '1797204510139158552',
                    date: '2024-04-24T08:43:06.000Z',
                    flags: [],
                    labels: ['\\Important', '\\Inbox'],
                    unseen: true,
                    size: 13646,
                    subject: 'Re: Outreach',
                    from: {
                        name: 'Ilham Fadhilah',
                        address: 'fadhilahilham.27@gmail.com',
                    },
                    replyTo: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'fadhilahilham.27@gmail.com',
                        },
                    ],
                    sender: {
                        name: 'Ilham Fadhilah',
                        address: 'fadhilahilham.27@gmail.com',
                    },
                    to: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'ilham@boostbot.ai',
                        },
                    ],
                    messageId: '<CAFWW5SM=EwJ0cPn4ouVNpzhG437JesEVLCvyRt7Nt7YBKqVEuA@mail.gmail.com>',
                    inReplyTo: '<CAFWW5SM6WqTMNgGs1ppLNFk4sfyGSsOJsmmQpA9oQiV6dAjaDg@mail.gmail.com>',
                    headers: {
                        'delivered-to': ['ilham@boostbot.ai'],
                        received: [
                            'by 2002:ab0:7255:0:b0:7e7:924f:a2c3 with SMTP id d21csp323463uap; Wed, 24 Apr 2024 01:43:17 -0700 (PDT)',
                            'from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41]) by mx.google.com with SMTPS id 14-20020a0561220a0e00b004ccbf387bbdsor12166273vkn.0.2024.04.24.01.43.17 for <ilham@boostbot.ai> (Google Transport Security); Wed, 24 Apr 2024 01:43:17 -0700 (PDT)',
                        ],
                        'x-received': [
                            'by 2002:a05:6122:1796:b0:4da:e6ee:5533 with SMTP id o22-20020a056122179600b004dae6ee5533mr1909897vkf.16.1713948197771; Wed, 24 Apr 2024 01:43:17 -0700 (PDT)',
                            'by 2002:a05:6122:a05:b0:4c0:1bb6:322 with SMTP id 5-20020a0561220a0500b004c01bb60322mr1887003vkn.15.1713948197237; Wed, 24 Apr 2024 01:43:17 -0700 (PDT)',
                        ],
                        'arc-seal': [
                            'i=1; a=rsa-sha256; t=1713948197; cv=none; d=google.com; s=arc-20160816; b=enkBZG6XWeO0Dpy7Rtc0lxvDI92yt83sR5sQ62HuiXpeTVl4rxabfutlSmpAGxn2gJ Kae3mGwJMwgMCdsTkkCTr122FQZWJjFO4WPOGx5X1xnsHtBv9WWzoQ71IgdFhzeiD7y/ tDOOR3Y0HwtmjKGH7cvDcW+5dwjRM03aQYfUr/Cz8A9bEtFHb7YQYNeYn05/WbyFi6A/ wVmLob+rWGaBTPUSuX6LzsYB3NAlCglov7euQ37vHrDjSQlYoZuZRZ3UNKzzj6tJeCxr D+D1aWgCHtbR0KDeNsBrXvGv8R5bMv1gz+tQ59v5JAbzD4YBgzVXEALhx7acPcfel2pM 5IDA==',
                        ],
                        'arc-message-signature': [
                            'i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :dkim-signature; bh=tMNdtcsVLTAkxlw65BETfLGbFRfe13DG/YfyhSuHy+Q=; fh=yr5Lcu7LkrKgTul/MRZy1ytQQAMQCWiE2YmG20M0hW8=; b=bqykqT/AOZDKq4+tYl6/CuI9sNDSVH7XiO6USUMW8SyhJsqfwsAReBXNRAq053UElZ AN9A44StD4pjHibEumYBixuMm1I/F4ph3oErWGF88HKtItWQP7d/2hL1hqifmL7H1irc uUnAHN4mB5Kh5NYuYXB+erfcTrRSBvpxwLB7rjdo0f21f75+SOfcqJYmbggNPO5sqYc8 VGXJJDwl4RkKzUW5a/c9IfpABFFAK8VeDqzEb1kQ8LR+B8wOpa4mUrNqjwNYY1eyiWh1 xZpMcT/5Hjg/tIA0vcEwIUCjN58VmFw4ftc4yshitDVjWQzASTd8VJxBsrBjuOhYZAxB /X6w==; dara=google.com',
                        ],
                        'arc-authentication-results': [
                            'i=1; mx.google.com; dkim=pass header.i=@gmail.com header.s=20230601 header.b="hpe5p/fj"; spf=pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=fadhilahilham.27@gmail.com; dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
                        ],
                        'return-path': ['<fadhilahilham.27@gmail.com>'],
                        'received-spf': [
                            'pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;',
                        ],
                        'authentication-results': [
                            'mx.google.com; dkim=pass header.i=@gmail.com header.s=20230601 header.b="hpe5p/fj"; spf=pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=fadhilahilham.27@gmail.com; dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
                        ],
                        'dkim-signature': [
                            'v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20230601; t=1713948197; x=1714552997; darn=boostbot.ai; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :from:to:cc:subject:date:message-id:reply-to; bh=tMNdtcsVLTAkxlw65BETfLGbFRfe13DG/YfyhSuHy+Q=; b=hpe5p/fjQGsvkCzK4bx5ARN/ixqNyF/NLHtW7mCjqGVpGh3JPWyImdI+OFlKVeasF3 tRHUjzenuWVOKzcCNbF8wmOhIvTnlMIebfzZuPqd+XJEuzijLHbwB89Ue+KIYhMZP0qi pCUrLMs5xC207bE9cmI+Hrli3bO+p7c/WAn77ORdzmnehbZ7SlXJeoZQAArhhSYba5v+ 8lyQXMp05EGUB4bMvUtx0bxVryuHvIRzqb9USuO7/03K5z0tkJRKoxFvjg7z4zuhX91M AuOacVtYAqe+tCQodo/GbLcf6efts1nxaQL1xvLAg7AQR4abrXn9hVGm8KQU3WLzBu58 H+eQ==',
                        ],
                        'x-google-dkim-signature': [
                            'v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1713948197; x=1714552997; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=tMNdtcsVLTAkxlw65BETfLGbFRfe13DG/YfyhSuHy+Q=; b=IQVg3MtMCV00Hpgky9zZad0jTnLI/biHV9ZYJ/q0CdiXvAi5fkfEX9EMsw6F0pqf/U yJ3i0vUq73HkFh6gpjHnmUL6m0Y5e98ja3JAe6iwDUewlPDzD+yLH1xQjXwN8V2jP1vn XUYx2DxJfwbzmCa5SZY16qyMp1Q8W1O4GhHM0D3m2Rlq6zLj0xapdYQqPJMx3zKumoT8 4e/piJf9kWqihY8KXl4huD4Dl7H7GnAz6+ETbJOE4gwjVGfM1STOPVV56b5zknoCJWOh rdrRK3skulzeaSZ5ehp/jLHMVmysIng5hfEPNzNPdP9eQH4O1WBfRVMxlLJFYC2O8uLV yw3g==',
                        ],
                        'x-gm-message-state': [
                            'AOJu0Yy3+pTTHr0J8T+wPRr/Ocr5hwfJ7mAxa0SClSnBJY0ANm7JWmWj wRK0gPGELQ84IueOA26+olGPAqbigBFLqKvrfXRpdxY3sMJP7IoFdn+VXEIACRBLBEBXuscCduL pgoqmVxGXVW+VOaK+oQaHliYm+wSx2w==',
                        ],
                        'x-google-smtp-source': [
                            'AGHT+IH3bkJBhHnqW9cu7FOwuHQb0EIz0UmPbloFtFSApDabuBi6wMZ6nN0i1qaZxedn5wcyKOzqUcJlVED7E2YTVoI=',
                        ],
                        'mime-version': ['1.0'],
                        references: [
                            '<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com> <CAFWW5SPbPx-45WQsUq-ChzSEhzJ-WUQW1nzryDQNJD5hTrFiTw@mail.gmail.com> <CAFWW5SM6WqTMNgGs1ppLNFk4sfyGSsOJsmmQpA9oQiV6dAjaDg@mail.gmail.com>',
                        ],
                        'in-reply-to': ['<CAFWW5SM6WqTMNgGs1ppLNFk4sfyGSsOJsmmQpA9oQiV6dAjaDg@mail.gmail.com>'],
                        from: ['Ilham Fadhilah <fadhilahilham.27@gmail.com>'],
                        date: ['Wed, 24 Apr 2024 15:43:06 +0700'],
                        'message-id': ['<CAFWW5SM=EwJ0cPn4ouVNpzhG437JesEVLCvyRt7Nt7YBKqVEuA@mail.gmail.com>'],
                        subject: ['Re: Outreach'],
                        to: ['Ilham Fadhilah <ilham@boostbot.ai>'],
                        'content-type': ['multipart/alternative; boundary="00000000000075dda50616d3a9f7"'],
                    },
                    text: {
                        id: 'AAAAAQAAAJCTkaExkaEykA',
                        plain: 'Helloooo\n\nOn Wed, 24 Apr 2024 at 15:41, Ilham Fadhilah <fadhilahilham.27@gmail.com>\nwrote:\n\n> Hello again!\n>\n> On Wed, 24 Apr 2024 at 15:37, Ilham Fadhilah <fadhilahilham.27@gmail.com>\n> wrote:\n>\n>> Hello Botaski! KamiYozora here!\n>>\n>> On Wed, 24 Apr 2024 at 15:36, Ilham Fadhilah <ilham@boostbot.ai> wrote:\n>>\n>>> Outreach  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>>\n>>> Hey KamiYozora,\n>>>\n>>> Botaski here from Botacorp. I just saw your "Among Us Game Night #1"\n>>> <http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc>\n>>> post, and I gotta say, love your content style 🤩.\n>>>\n>>> We\'d love to work together with you on a Botacorp collab! Have a feeling\n>>> Botasight <http://botacorp.com/botasight> is something your audience\n>>> would be really into!\n>>>\n>>> Botacorp is a product for finding you a nice products\n>>>\n>>> We’re looking to partner with 8 or so influencers to get the word out\n>>> about Botasight over the next couple weeks, and would love for you to be\n>>> apart of it.\n>>>\n>>> Let me know if this is something you\'d be interested in!\n>>>\n>>> Cheers,\n>>>\n>>> Botaski at Botacorp\n>>>\n>>\n',
                        html: '<div dir="ltr">Helloooo</div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Wed, 24 Apr 2024 at 15:41, Ilham Fadhilah &lt;<a href="mailto:fadhilahilham.27@gmail.com">fadhilahilham.27@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex"><div dir="ltr">Hello again!</div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Wed, 24 Apr 2024 at 15:37, Ilham Fadhilah &lt;<a href="mailto:fadhilahilham.27@gmail.com" target="_blank">fadhilahilham.27@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex"><div dir="ltr">Hello Botaski! KamiYozora here!</div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Wed, 24 Apr 2024 at 15:36, Ilham Fadhilah &lt;<a href="mailto:ilham@boostbot.ai" target="_blank">ilham@boostbot.ai</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">\n<div style="max-height:0px;max-width:1px;font-size:1px;line-height:1px;opacity:0;display:none;overflow:hidden">Outreach  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏ </div>\n\n<p>Hey KamiYozora,</p>\n<p>Botaski here from Botacorp. I just saw your <a href="http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&amp;sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc" target="_blank">&quot;Among Us Game Night #1&quot;</a> post, and I gotta say, love your content style 🤩.</p> \n<br>    \n<p>We&#39;d love to work together with you on a Botacorp collab! Have a feeling <a href="http://botacorp.com/botasight" target="_blank">Botasight</a> is something your audience would be really into!</p>\n<br>\n<p>Botacorp is a product for finding you a nice products</p>\n<br>\n<p>We’re looking to partner with 8 or so influencers to get the word out about Botasight over the next couple weeks, and would love for you to be apart of it.</p>\n<p>Let me know if this is something you&#39;d be interested in!</p>\n<br>\n<p>Cheers,</p>\n<br>\n<p>Botaski at Botacorp</p><img src="http://localhost:4000/open.gif?data=eyJhY3QiOiJvcGVuIiwiYWNjIjoiaWxoYW1AYm9vc3Rib3QuYWkiLCJtc2ciOiI8NmE2YjY0NjAtZTY0Mi00NmEyLTg4OWMtODNjMDk3NWE0MGU4QGdtYWlsLmNvbT4ifQ&amp;sig=fN9t4iDpD2UD92Ukt164lfAywQXuqd0B9Z69fiyal2M" style="border: 0px; width: 1px; height: 1px;" width="1" height="1" alt="">\n</blockquote></div>\n</blockquote></div>\n</blockquote></div>\n',
                        encodedSize: {
                            plain: 3114,
                            html: 4900,
                        },
                        hasMore: false,
                    },
                    messageSpecialUse: '\\Inbox',
                },
                {
                    path: '[Gmail]/All Mail',
                    specialUse: '\\All',
                    id: 'AAAAAQAAAI8',
                    uid: 143,
                    emailId: '1797204814524541811',
                    threadId: '1797204510139158552',
                    date: '2024-04-24T08:41:01.000Z',
                    flags: [],
                    labels: ['\\Important', '\\Inbox'],
                    unseen: true,
                    size: 12849,
                    subject: 'Re: Outreach',
                    from: {
                        name: 'Ilham Fadhilah',
                        address: 'fadhilahilham.27@gmail.com',
                    },
                    replyTo: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'fadhilahilham.27@gmail.com',
                        },
                    ],
                    sender: {
                        name: 'Ilham Fadhilah',
                        address: 'fadhilahilham.27@gmail.com',
                    },
                    to: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'ilham@boostbot.ai',
                        },
                    ],
                    messageId: '<CAFWW5SM6WqTMNgGs1ppLNFk4sfyGSsOJsmmQpA9oQiV6dAjaDg@mail.gmail.com>',
                    inReplyTo: '<CAFWW5SPbPx-45WQsUq-ChzSEhzJ-WUQW1nzryDQNJD5hTrFiTw@mail.gmail.com>',
                    headers: {
                        'delivered-to': ['ilham@boostbot.ai'],
                        received: [
                            'by 2002:ab0:7255:0:b0:7e7:924f:a2c3 with SMTP id d21csp322754uap; Wed, 24 Apr 2024 01:41:13 -0700 (PDT)',
                            'from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41]) by mx.google.com with SMTPS id l12-20020a67fe0c000000b0047bdc3cab52sor7052192vsr.8.2024.04.24.01.41.12 for <ilham@boostbot.ai> (Google Transport Security); Wed, 24 Apr 2024 01:41:12 -0700 (PDT)',
                        ],
                        'x-received': [
                            'by 2002:a05:6102:1625:b0:47a:316c:2e19 with SMTP id cu37-20020a056102162500b0047a316c2e19mr2067728vsb.23.1713948072843; Wed, 24 Apr 2024 01:41:12 -0700 (PDT)',
                            'by 2002:a05:6102:1906:b0:47c:ba7:5779 with SMTP id jk6-20020a056102190600b0047c0ba75779mr1353208vsb.31.1713948072342; Wed, 24 Apr 2024 01:41:12 -0700 (PDT)',
                        ],
                        'arc-seal': [
                            'i=1; a=rsa-sha256; t=1713948072; cv=none; d=google.com; s=arc-20160816; b=oCRys7531DmpLObcBfufHBjc/vOPuO9AwxM7NVGt3i9M8u/2WGGxvHA2UlAW3wcuRZ kP+kbawcmBhpj675pEMwXdQctv2jLEIUUT4sii01mHRcxZ79OPI5DFFdEnPtdYxQomX1 9kF5aDBieLZyibcQjXDw4Ho67T/HiAT1woA5yPADDirfu11oLSRIA5v/g94sHlwTkaVm 0siwYgNjejMxl8fH04xTpbD3WVy/yFB3J5fb/+74rcFU808wD6VXV9Csh3R+ENizEUfB LBBH7bS2HZrbzLyKbKXpurgoKcH4DFdC6sHUhN/x5DsyIb2I/vW9KKcZLpjQrmgxJgXH YFzQ==',
                        ],
                        'arc-message-signature': [
                            'i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :dkim-signature; bh=ikFk9en9K3Z9zKhzwsVZvn9xBGJp71FoFKvdIBZcSgE=; fh=yr5Lcu7LkrKgTul/MRZy1ytQQAMQCWiE2YmG20M0hW8=; b=zFTGVejipFKVpzqwryHpbnUeZDHfYyMcbGMfiL4zvxnWJrVmGEh8cKMxC4YXvGrSnK Q0uwx8CFNedCT3S2rnB/ppaiXWJRpBjNH/iosIIW6+f0/F7m4p2h9GGOhZFuZY68doTz aBxhcTXnRaDPyT0Lp2IYbqKdPRKnGdmSPDmuGPX163dpc7HkW7a3b7dHIkLkaEQWCpSG BVnwslFXs67btTTHzJAp8/rhucq8oZkiZ1IL6E9N3P//klN3Y/zz7xyQTrpRz6TmxSdU mXKb3p3CotkyML/na+/WB2P9w77tnouR0ofy3yW/8GQROkDlO+oozIJhRIjsssPSaF8s 4OiA==; dara=google.com',
                        ],
                        'arc-authentication-results': [
                            'i=1; mx.google.com; dkim=pass header.i=@gmail.com header.s=20230601 header.b=KyCHau1N; spf=pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=fadhilahilham.27@gmail.com; dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
                        ],
                        'return-path': ['<fadhilahilham.27@gmail.com>'],
                        'received-spf': [
                            'pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;',
                        ],
                        'authentication-results': [
                            'mx.google.com; dkim=pass header.i=@gmail.com header.s=20230601 header.b=KyCHau1N; spf=pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=fadhilahilham.27@gmail.com; dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
                        ],
                        'dkim-signature': [
                            'v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20230601; t=1713948072; x=1714552872; darn=boostbot.ai; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :from:to:cc:subject:date:message-id:reply-to; bh=ikFk9en9K3Z9zKhzwsVZvn9xBGJp71FoFKvdIBZcSgE=; b=KyCHau1NtFiNHkQzF1pPpDxP0ak16zSWU3EeZ6/+sQaixSbM8vawJm0rWKOEqAu3no qp6FGtJLZXztuVD3MxcNvYEReXEznFJbGxvqw9ZyRSHkLzMbmHuIjFQ4Nn9y1P2EAANz UsvrSWtnIlViihQqRNzd9M1qXCqBrBrwaghLNpnOrsj4wCAz3lILkiBxPhCVXe12eION XaiwYVYYYq8aHERFjtsP1Q0UjIUQRBun8Rf2s9+UdlrZra77e5U+YlSGkqUfy60zRkJN S5YV80/ae3Q7RBFnt12TspNMq+l/P7qLgxcAf4ru82GKh7+WdGXXY2cnnRGJfReCTSdR rgEQ==',
                        ],
                        'x-google-dkim-signature': [
                            'v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1713948072; x=1714552872; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=ikFk9en9K3Z9zKhzwsVZvn9xBGJp71FoFKvdIBZcSgE=; b=C9Hm+xeO/b83Md/k5kazhv8LTLu1+HfD1883/WD9sASD48VUTi4T38slmSm7SJ9sU/ k3T815Ianz7/biQdc1Su7yWUS+nmKAb3lZZm78bXR4tgbWW5z8Ua2ei4lzt7erzuqPjC gaEcJWoJHwrKyeC07fSwxQ9sP5j70OYPr/DKftA3/2nMDJqcGhx+VW2xa4l96yNlcc1j adzUcrZsIOAxW90sZXrD638F5U5sxIrLg9D7yGZCuoB1TmpDFNF60YSQOSS5B6phqhZA SBJmtglh2zIThrwtnyO186fKdmqAFLPLQFTVaXiQkHGGSHcRYvRiBG3xKWbz6sMH8P0a U2zg==',
                        ],
                        'x-gm-message-state': [
                            'AOJu0YwzlexuvlLNeh1up7JFWPBEWxR+T1uisykSyIeWCeguLBmP+gQq N/JSCdRX4al0a6I8MqNoRAOQkcFgpz41QIY4pNO63EBAk5WKZjR6SJ4vze5Snl0DeKiomIcbPKc QQ4VUjCoyLEh6/fhCh6iRmbiWoU/pJA==',
                        ],
                        'x-google-smtp-source': [
                            'AGHT+IHHk7LbD04Ohym4xR6odREFuqUMEl3mcFLRVJmrsB0R4Z9Crx+AID0QbrQ75IyrQT5KPa1d5muSn0uI+k7XUkE=',
                        ],
                        'mime-version': ['1.0'],
                        references: [
                            '<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com> <CAFWW5SPbPx-45WQsUq-ChzSEhzJ-WUQW1nzryDQNJD5hTrFiTw@mail.gmail.com>',
                        ],
                        'in-reply-to': ['<CAFWW5SPbPx-45WQsUq-ChzSEhzJ-WUQW1nzryDQNJD5hTrFiTw@mail.gmail.com>'],
                        from: ['Ilham Fadhilah <fadhilahilham.27@gmail.com>'],
                        date: ['Wed, 24 Apr 2024 15:41:01 +0700'],
                        'message-id': ['<CAFWW5SM6WqTMNgGs1ppLNFk4sfyGSsOJsmmQpA9oQiV6dAjaDg@mail.gmail.com>'],
                        subject: ['Re: Outreach'],
                        to: ['Ilham Fadhilah <ilham@boostbot.ai>'],
                        'content-type': ['multipart/alternative; boundary="00000000000003fd6a0616d3a213"'],
                    },
                    text: {
                        id: 'AAAAAQAAAI-TkaExkaEykA',
                        plain: 'Hello again!\n\nOn Wed, 24 Apr 2024 at 15:37, Ilham Fadhilah <fadhilahilham.27@gmail.com>\nwrote:\n\n> Hello Botaski! KamiYozora here!\n>\n> On Wed, 24 Apr 2024 at 15:36, Ilham Fadhilah <ilham@boostbot.ai> wrote:\n>\n>> Outreach  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>>\n>> Hey KamiYozora,\n>>\n>> Botaski here from Botacorp. I just saw your "Among Us Game Night #1"\n>> <http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc>\n>> post, and I gotta say, love your content style 🤩.\n>>\n>> We\'d love to work together with you on a Botacorp collab! Have a feeling\n>> Botasight <http://botacorp.com/botasight> is something your audience\n>> would be really into!\n>>\n>> Botacorp is a product for finding you a nice products\n>>\n>> We’re looking to partner with 8 or so influencers to get the word out\n>> about Botasight over the next couple weeks, and would love for you to be\n>> apart of it.\n>>\n>> Let me know if this is something you\'d be interested in!\n>>\n>> Cheers,\n>>\n>> Botaski at Botacorp\n>>\n>\n',
                        html: '<div dir="ltr">Hello again!</div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Wed, 24 Apr 2024 at 15:37, Ilham Fadhilah &lt;<a href="mailto:fadhilahilham.27@gmail.com">fadhilahilham.27@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex"><div dir="ltr">Hello Botaski! KamiYozora here!</div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Wed, 24 Apr 2024 at 15:36, Ilham Fadhilah &lt;<a href="mailto:ilham@boostbot.ai" target="_blank">ilham@boostbot.ai</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">\n<div style="max-height:0px;max-width:1px;font-size:1px;line-height:1px;opacity:0;display:none;overflow:hidden">Outreach  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏ </div>\n\n<p>Hey KamiYozora,</p>\n<p>Botaski here from Botacorp. I just saw your <a href="http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&amp;sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc" target="_blank">&quot;Among Us Game Night #1&quot;</a> post, and I gotta say, love your content style 🤩.</p> \n<br>    \n<p>We&#39;d love to work together with you on a Botacorp collab! Have a feeling <a href="http://botacorp.com/botasight" target="_blank">Botasight</a> is something your audience would be really into!</p>\n<br>\n<p>Botacorp is a product for finding you a nice products</p>\n<br>\n<p>We’re looking to partner with 8 or so influencers to get the word out about Botasight over the next couple weeks, and would love for you to be apart of it.</p>\n<p>Let me know if this is something you&#39;d be interested in!</p>\n<br>\n<p>Cheers,</p>\n<br>\n<p>Botaski at Botacorp</p><img src="http://localhost:4000/open.gif?data=eyJhY3QiOiJvcGVuIiwiYWNjIjoiaWxoYW1AYm9vc3Rib3QuYWkiLCJtc2ciOiI8NmE2YjY0NjAtZTY0Mi00NmEyLTg4OWMtODNjMDk3NWE0MGU4QGdtYWlsLmNvbT4ifQ&amp;sig=fN9t4iDpD2UD92Ukt164lfAywQXuqd0B9Z69fiyal2M" style="border: 0px; width: 1px; height: 1px;" width="1" height="1" alt="">\n</blockquote></div>\n</blockquote></div>\n',
                        encodedSize: {
                            plain: 2926,
                            html: 4362,
                        },
                        hasMore: false,
                    },
                    messageSpecialUse: '\\Inbox',
                },
                {
                    path: '[Gmail]/All Mail',
                    specialUse: '\\All',
                    id: 'AAAAAQAAAI4',
                    uid: 142,
                    emailId: '1797204564051650961',
                    threadId: '1797204510139158552',
                    date: '2024-04-24T08:37:02.000Z',
                    flags: [],
                    labels: ['\\Important', '\\Inbox'],
                    unseen: true,
                    size: 12024,
                    subject: 'Re: Outreach',
                    from: {
                        name: 'Ilham Fadhilah',
                        address: 'fadhilahilham.27@gmail.com',
                    },
                    replyTo: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'fadhilahilham.27@gmail.com',
                        },
                    ],
                    sender: {
                        name: 'Ilham Fadhilah',
                        address: 'fadhilahilham.27@gmail.com',
                    },
                    to: [
                        {
                            name: 'Ilham Fadhilah',
                            address: 'ilham@boostbot.ai',
                        },
                    ],
                    messageId: '<CAFWW5SPbPx-45WQsUq-ChzSEhzJ-WUQW1nzryDQNJD5hTrFiTw@mail.gmail.com>',
                    inReplyTo: '<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com>',
                    headers: {
                        'delivered-to': ['ilham@boostbot.ai'],
                        received: [
                            'by 2002:ab0:7255:0:b0:7e7:924f:a2c3 with SMTP id d21csp321279uap; Wed, 24 Apr 2024 01:37:14 -0700 (PDT)',
                            'from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41]) by mx.google.com with SMTPS id q193-20020a1ff2ca000000b004d428d130c8sor9821074vkh.9.2024.04.24.01.37.13 for <ilham@boostbot.ai> (Google Transport Security); Wed, 24 Apr 2024 01:37:13 -0700 (PDT)',
                        ],
                        'x-received': [
                            'by 2002:a05:6122:a25:b0:4d4:15d2:8b3b with SMTP id 37-20020a0561220a2500b004d415d28b3bmr1953530vkn.9.1713947833994; Wed, 24 Apr 2024 01:37:13 -0700 (PDT)',
                            'by 2002:a05:6122:c9c:b0:4d3:b326:5ae8 with SMTP id ba28-20020a0561220c9c00b004d3b3265ae8mr1963867vkb.14.1713947833492; Wed, 24 Apr 2024 01:37:13 -0700 (PDT)',
                        ],
                        'arc-seal': [
                            'i=1; a=rsa-sha256; t=1713947833; cv=none; d=google.com; s=arc-20160816; b=kA4fz8DyEll/hUlja3Nr3fuGtc1HQXKKFjSOMtfbJAH4T4KrPbLJmWIF74/Pr96quG mteAYGcMpTDbrDcNyYNMRrk60lbgXCDmqwkbaEpsp1lW8zJnDdU7NMfY6fCpM6pXTjXs RHTAf1r5KOgk7MX4ZMfyBIZW4R7VdQVSbJJGpm5r+IPfMYsrugLoIWoqwL6GDclDJBL+ SpzZ/8sYvGY1wz1tHpYcQZX+IyA5SrKPkDaVKIDUjSq1hhq4oetMxx7fNGDoVvU/cdaa 7W3wZz74CG0YfaYwrh4a5ynUsbmdt2uL/C42qFk83xExfarqTZgBVQ81m7jIOuKM8Qzt ZyNw==',
                        ],
                        'arc-message-signature': [
                            'i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :dkim-signature; bh=ATsYBVA0YvA/rFaobJa6mCWqQoALtvJNg6DxTMiwzpI=; fh=yr5Lcu7LkrKgTul/MRZy1ytQQAMQCWiE2YmG20M0hW8=; b=YttiUchd6msrjrPzpUgoPc0OKlYeHtkR9Hg1V5nWuqEHHjHbvgVmuQX/8ODuiq7B5R Afun2qqL2PfLhJc1Mv7Kx6/hADpl4VdQ6fel3mml3BYh7xpJz2MV7WL+2Y/JztKSlPpj 8HkrILjARkzbZFWQXvZ2fX3RpYPOoklLEOMOkGt+8/toy38ESs7f2krd3Szg7spaJzDC MnwX934cv4ZrdCaKZLJvl5eFX9kM5Ia3HhvH6OUlKXY9/15HKZqV03oyKTKahiI3lOzD pczI6fc2UoiJHCCOHxY6t6sEax6xsg/Z1SPsfVG+9GfEQZ7JuIkTrEUvvmXGHkjUzLZ4 UHsg==; dara=google.com',
                        ],
                        'arc-authentication-results': [
                            'i=1; mx.google.com; dkim=pass header.i=@gmail.com header.s=20230601 header.b=TpULaVeW; spf=pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=fadhilahilham.27@gmail.com; dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
                        ],
                        'return-path': ['<fadhilahilham.27@gmail.com>'],
                        'received-spf': [
                            'pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;',
                        ],
                        'authentication-results': [
                            'mx.google.com; dkim=pass header.i=@gmail.com header.s=20230601 header.b=TpULaVeW; spf=pass (google.com: domain of fadhilahilham.27@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=fadhilahilham.27@gmail.com; dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
                        ],
                        'dkim-signature': [
                            'v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20230601; t=1713947833; x=1714552633; darn=boostbot.ai; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :from:to:cc:subject:date:message-id:reply-to; bh=ATsYBVA0YvA/rFaobJa6mCWqQoALtvJNg6DxTMiwzpI=; b=TpULaVeWBn/45q7DY07oMywbmiWq5HatHvbJ+bRia4oFd/UsZIaiZRQB+W5QB56GXv eMRqOeRCbPI/amyrcsqvJ5EBut9jkkqvqtWl9InSB4Fyk8lpOVLqfeEhRlSrOEppX/15 sDdWZEJpFKT1prBzaLGix7et+1AdNY3b46xRA5eFn/SjKOzEzGKK4WSDikCGE5foyfMg tymCkL8DtIFd6WKBbgVAxumbE1ArslMEN7JgVU+8KqscSVXyZQWGOzYfxu9iu/Cqdzo6 YJAqPDweXr6+QIkXlRZSonXpgM4z3EBOf+fwLsMOmFb20lkHC5mo1s0g4FjA6mfr5otx 9Zqg==',
                        ],
                        'x-google-dkim-signature': [
                            'v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1713947833; x=1714552633; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=ATsYBVA0YvA/rFaobJa6mCWqQoALtvJNg6DxTMiwzpI=; b=PbICXwkHyJAfELP5+jFmXjbGzS0A26LJXlaHmNSRp6MfhsrhN8iul5naYzf7KH3C2v 9KmZ9PXkPpVy5nrYKTqD1InfbF5oDysFRVjDnY7QEYltcnH265q7NWFNpna9hUP2sS8V 5YqaKVWhnX1MrEQpW0KfUGuq7Brx+sXVozudz6I2vKOex7K+xmLHsQTWqS8OBjbUy07e r9fMhYXGRhFlu4L9fnvNHTt7QHmAOTnEfB0VeFNG1VkXqxecpom4TCwUfxDcZDjNYgMG dx3kisV36FTnX/EgfCrAWtQjsHwRKmeIqq6qGHFiEU9PpmIfB25gABR/gSN+zhE9DwC6 zcBw==',
                        ],
                        'x-gm-message-state': [
                            'AOJu0Ywj6OfHVdSNKpxQQT0jiR2houzOOQAHKkjNTwG+6LpeIqcQi/dI pUGbqs9Gfxm4kmAQj0KLh7tNTt24EQoRBB44FOJy30F7xZQieSNWfPnot3sPUO11r5n37F50bAq 2YxksR3TDGkSV8m8OPR1wwnweCVS8tw==',
                        ],
                        'x-google-smtp-source': [
                            'AGHT+IGryAQaw+2rbBo8ECmZXWDMbK/wWo83jd2Z30q83TXE9TwHHjdsl7CXJZDriKl90QrIrTAD9d5dDZAvKl0n8KA=',
                        ],
                        'mime-version': ['1.0'],
                        references: ['<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com>'],
                        'in-reply-to': ['<6a6b6460-e642-46a2-889c-83c0975a40e8@gmail.com>'],
                        from: ['Ilham Fadhilah <fadhilahilham.27@gmail.com>'],
                        date: ['Wed, 24 Apr 2024 15:37:02 +0700'],
                        'message-id': ['<CAFWW5SPbPx-45WQsUq-ChzSEhzJ-WUQW1nzryDQNJD5hTrFiTw@mail.gmail.com>'],
                        subject: ['Re: Outreach'],
                        to: ['Ilham Fadhilah <ilham@boostbot.ai>'],
                        'content-type': ['multipart/alternative; boundary="000000000000c76cfe0616d39363"'],
                    },
                    text: {
                        id: 'AAAAAQAAAI6TkaExkaEykA',
                        plain: 'Hello Botaski! KamiYozora here!\n\nOn Wed, 24 Apr 2024 at 15:36, Ilham Fadhilah <ilham@boostbot.ai> wrote:\n\n> Outreach  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏\n>\n> Hey KamiYozora,\n>\n> Botaski here from Botacorp. I just saw your "Among Us Game Night #1"\n> <http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc>\n> post, and I gotta say, love your content style 🤩.\n>\n> We\'d love to work together with you on a Botacorp collab! Have a feeling\n> Botasight <http://botacorp.com/botasight> is something your audience\n> would be really into!\n>\n> Botacorp is a product for finding you a nice products\n>\n> We’re looking to partner with 8 or so influencers to get the word out\n> about Botasight over the next couple weeks, and would love for you to be\n> apart of it.\n>\n> Let me know if this is something you\'d be interested in!\n>\n> Cheers,\n>\n> Botaski at Botacorp\n>\n',
                        html: '<div dir="ltr">Hello Botaski! KamiYozora here!</div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Wed, 24 Apr 2024 at 15:36, Ilham Fadhilah &lt;<a href="mailto:ilham@boostbot.ai">ilham@boostbot.ai</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">\n<div style="max-height:0px;max-width:1px;font-size:1px;line-height:1px;opacity:0;display:none;overflow:hidden">Outreach  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏  ﻿͏ </div>\n\n<p>Hey KamiYozora,</p>\n<p>Botaski here from Botacorp. I just saw your <a href="http://localhost:4000/redirect?data=eyJhY3QiOiJjbGljayIsInVybCI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3YmI3gzRDtVTzZpWFBkeFJCWSIsImFjYyI6ImlsaGFtQGJvb3N0Ym90LmFpIiwibXNnIjoiPDZhNmI2NDYwLWU2NDItNDZhMi04ODljLTgzYzA5NzVhNDBlOEBnbWFpbC5jb20-In0&amp;sig=aRGzgYa-f0RCpViKl4dPnScGuPoz0rt8g827vyrPIGc" target="_blank">&quot;Among Us Game Night #1&quot;</a> post, and I gotta say, love your content style 🤩.</p> \n<br>    \n<p>We&#39;d love to work together with you on a Botacorp collab! Have a feeling <a href="http://botacorp.com/botasight" target="_blank">Botasight</a> is something your audience would be really into!</p>\n<br>\n<p>Botacorp is a product for finding you a nice products</p>\n<br>\n<p>We’re looking to partner with 8 or so influencers to get the word out about Botasight over the next couple weeks, and would love for you to be apart of it.</p>\n<p>Let me know if this is something you&#39;d be interested in!</p>\n<br>\n<p>Cheers,</p>\n<br>\n<p>Botaski at Botacorp</p><img src="http://localhost:4000/open.gif?data=eyJhY3QiOiJvcGVuIiwiYWNjIjoiaWxoYW1AYm9vc3Rib3QuYWkiLCJtc2ciOiI8NmE2YjY0NjAtZTY0Mi00NmEyLTg4OWMtODNjMDk3NWE0MGU4QGdtYWlsLmNvbT4ifQ&amp;sig=fN9t4iDpD2UD92Ukt164lfAywQXuqd0B9Z69fiyal2M" style="border: 0px; width: 1px; height: 1px;" width="1" height="1" alt="">\n</blockquote></div>\n',
                        encodedSize: {
                            plain: 2738,
                            html: 3816,
                        },
                        hasMore: false,
                    },
                    messageSpecialUse: '\\Inbox',
                },
            ],
        },
        mutate: (...args) => {
            // do nothing
        },
    };
    const endOfThread = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        endOfThread.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages?.items]);
    const threadContact = useMemo(() => {
        if (selectedThread) {
            const cc =
                selectedThread.contacts
                    ?.filter((c) => ['cc', 'bcc'].includes(c.type as string))
                    .map((c) => ({
                        name: c.emailContact?.name || '',
                        address: c.emailContact?.address || '',
                    })) || [];
            const to =
                selectedThread.contacts
                    ?.filter((c) => !['cc', 'bcc', 'user'].includes(c.type as string))
                    .map((c) => ({
                        name: c.emailContact?.name || '',
                        address: c.emailContact?.address || '',
                    })) || [];
            return {
                cc,
                to,
            };
        }
        return {
            cc: [],
            to: [],
        };
    }, [selectedThread]);
    const [attachments, setAttachments] = useState<string[]>([]);

    const handleAttachmentSelect = (files: string[]) => {
        if (!files) return serverLogger('No files attached');
        setAttachments((attached) => {
            return [...attached, ...files];
        });
    };

    const handleRemoveAttachment = useCallback(
        (file: string) => {
            setAttachments((attached) => attached && [...attached.filter((f) => f !== file)]);
        },
        [setAttachments],
    );
    const { reply, loading: replyLoading } = useThreadReply();
    const handleReply = useCallback(
        async (replyBody: string, toList: EmailContact[], ccList: EmailContact[]) => {
            mutate(
                async (cache: Paginated<Email> | undefined): Promise<Paginated<Email>> => {
                    if (attachments && attachments.length > 0) {
                        const htmlAttachments = attachments.map((attachment) => {
                            return `<a target="__blank" href="${window.origin}/api/files/download-presign-url?path=${company?.id}/attachments/${attachment}">${attachment}</a>`;
                        });
                        // attach link of attachments to the html body content of the email
                        replyBody = `${replyBody}
                            <br/><br/>
                            <b>Attachments:</b><br/>
                            ${htmlAttachments.join('<br/>')}`;
                    }
                    await reply(selectedThread?.id as string, {
                        content: replyBody,
                        cc: ccList,
                        to: toList,
                    });
                    // Retain local data with generated data
                    const localMessage = generateLocalData({
                        body: replyBody,
                        from: { name: 'Me', address: myEmail || '' },
                        to: toList,
                        cc: ccList,
                        subject: messages?.items[messages.items.length - 1]?.subject ?? '',
                        attachments: [],
                    });
                    setAttachments([]);
                    return { ...cache, items: [localMessage, ...(cache?.items ?? [])] } as Paginated<Email>;
                },
                {
                    // Optimistically update the UI
                    // Seems like this is discarded when MutatorCallback ^ resolves
                    optimisticData: (cache: Paginated<Email> | undefined): Paginated<Email> => {
                        const localMessage = generateLocalData({
                            body: replyBody,
                            from: { name: 'Me', address: myEmail || '' },
                            to: toList,
                            cc: ccList,
                            subject: messages?.items[messages.items.length - 1]?.subject ?? '',
                            attachments: [],
                        });
                        return { ...cache, items: [localMessage, ...(cache?.items ?? [])] } as Paginated<Email>;
                    },
                    revalidate: false,
                    rollbackOnError: true,
                },
            );
        },
        [selectedThread, mutate, reply, myEmail, messages, attachments, company],
    );
    return (
        <section className={`h-full flex-auto flex-col`}>
            {loading ? (
                <>
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                </>
            ) : selectedThread ? (
                <div className="flex h-full flex-col bg-zinc-50">
                    <div className="flex-none bg-zinc-50">
                        <ThreadHeader
                            thread={selectedThread}
                            subject={messages && messages.items.length > 0 ? messages.items[0].subject : ''}
                        />
                    </div>

                    <div style={{ height: 10 }} className="m-5 flex-auto justify-center overflow-auto bg-zinc-50">
                        <ThreadMessageList messages={messages?.items || []} myEmail={myEmail} />
                        <div ref={endOfThread} />
                    </div>
                    <div className="m-5 bg-white">
                        <ThreadReply
                            loading={replyLoading}
                            defaultContacts={threadContact}
                            onReply={handleReply}
                            attachments={attachments}
                            handleRemoveAttachment={handleRemoveAttachment}
                            handleAttachmentSelect={handleAttachmentSelect}
                        />
                    </div>
                </div>
            ) : (
                <></>
            )}
        </section>
    );
}
