//for more information, refer to https://api.slack.com/messaging/composing/layouts
export interface SlackMessage {
    blocks: {
        type: string;
        text?: {
            type: string;
            text: string;
            emoji?: boolean;
        };
        emoji?: boolean;
        fields?: {
            type: string;
            text: string;
        }[];
        //...
    }[];
}

export const sendSlackMessage = async (url: string, message: SlackMessage) => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(message),
    });
    if (response.ok) {
        // eslint-disable-next-line no-console
        console.log('Slack message sent');
    } else {
        // eslint-disable-next-line no-console
        console.error('Slack message failed');
    }
};
