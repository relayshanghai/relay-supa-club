import boostbot from 'i18n/en/boostbot';
import { testMount } from '../../utils/cypress-app-wrapper';
import Message, { type MessageType } from './message';

describe('<Message />', () => {
    it('Displays the correct text message based on the message type', () => {
        const message: MessageType = {
            type: 'text',
            text: 'Hello, World!',
            sender: 'User',
        };

        testMount(<Message message={message} />);

        cy.get('div').contains('Hello, World!');
    });

    it('Displays the correct translation message based on the message type', () => {
        const message: MessageType = {
            type: 'translation',
            translationKey: 'boostbot.chat.sendPlaceholder',
            translationLink: 'www.example.com',
            translationValues: { count: 50 },
            sender: 'Bot',
        };

        testMount(<Message message={message} />);

        cy.get('div').contains(boostbot.chat.sendPlaceholder);
    });

    it('Displays the correct video message based on the message type', () => {
        const message: MessageType = {
            type: 'video',
            videoUrl: 'path/to/video.mp4',
            eventToTrack: 'video-play',
            sender: 'Bot',
        };

        testMount(<Message message={message} />);

        cy.get('div').find('video');
    });

    it('Displays the correct progress message based on the message type', () => {
        const message: MessageType = {
            type: 'progress',
            sender: 'Neutral',
            progressData: { topics: ['test topic'], isMidway: false, totalFound: null },
        };

        testMount(<Message message={message} />);

        cy.get('div').contains('test topic');
    });
});
