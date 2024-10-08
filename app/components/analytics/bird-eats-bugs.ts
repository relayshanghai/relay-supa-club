import { birdEatsBugEn } from 'i18n/en/bird-eats-bug';
import { birdEatsBugCn } from 'i18n/zh/bird-eats-bug';
import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_LANGUAGE_KEY, enUS, zhCN } from 'src/constants';

export interface WindowBirdEatsBug {
    birdeatsbug?: {
        setOptions: (options: BEGSDKOptions) => void;
    };
}

export interface BEGSDKOptions {
    publicAppId?: string;
    instantReplay?: boolean;
    recordVideo?: boolean;
    user?: {
        email?: string;
    };
    integrations?: IntegrationOptions;
    ui?: UIOptions;
    hooks?: HooksOptions;
    recordedEventTypes?: {
        [key in keyof RecordedEventTypesOptions]?: boolean;
    };
}

interface IntegrationOptions {
    intercom?: boolean;
    zendesk?: boolean;
}

interface UIOptions {
    theme?: 'light' | 'dark';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    watermark?: boolean;
    defaultButton?:
        | {
              icon?: 'brand' | 'exclamation' | false;
          }
        | false;
    recordingControls?: boolean;
    previewScreen?:
        | {
              visualProof?: 'optional' | 'required' | false;
              visualProofButtons?: {
                  screenshot?: boolean;
                  screenRecording?: boolean;
              };
              email?: 'optional' | 'required' | false;
              title?: 'optional' | 'required' | false;
              description?: 'optional' | 'required' | false;
          }
        | false;
    submitConfirmationScreen?:
        | {
              sessionLink?: boolean;
          }
        | false;
    text?: {
        defaultButton?: string;
        dismissButton?: string;
        recordingControls?: {
            starting?: string;
            recording?: string;
            recordingProgress?: string;
            stopRecordingButton?: string;
        };
        previewScreen?: {
            title?: string;
            visualProofMissingErrorMessage?: string;
            startScreenRecordingButton?: string;
            takeScreenshotButton?: string;
            replaceVisualProofButton?: string;
            removeVisualProofButton?: string;
            confirmVisualProofRemovalButton?: string;
            cancelButton?: string;
            emailInputPlaceholder?: string;
            titleInputPlaceholder?: string;
            descriptionInputPlaceholder?: string;
            collectionInputPlaceholder?: string;
            labelInputPlaceholder?: string;
            inputOptional?: string;
            submitButton?: string;
            uploadError?: string;
        };
        submitConfirmationScreen?: {
            title?: string;
            message?: string;
            copyLink?: string;
            copiedLink?: string;
            confirmationButton?: string;
        };
    };
}

interface HooksOptions {
    afterInit({
        isBrowserSupported,
        isScreenshotSupported,
        isVideoRecordingSupported,
        triggerButtons,
    }: {
        isBrowserSupported: boolean;
        isScreenshotSupported: boolean;
        isVideoRecordingSupported: boolean;
        triggerButtons: HTMLElement[];
    }): void;
    onTrigger(): Promise<void>;
    afterTrigger(): void;
    beforeScreenshot(): void;
    beforeRecording(): void;
    afterScreenshot(sessionDataPromise: Promise<SessionData>): void;
    afterRecording(sessionDataPromise: Promise<SessionData>): void;
    beforeUpload(sessionData: SessionData): Promise<SessionData>;
    afterUpload(sessionData: SessionData): Promise<void>;
    afterClose(): void;
}

interface SessionData {
    session: Session;
    events: any[];
    domEvents: any[];
    networkRequests: any[];
    // events: (ClickEvent | ConsoleEvent | NavigationEvent)[];
    // domEvents: DomEvent[];
    // networkRequests: NetworkEvent[];
    screenshot?: string;
    video?: string;
}

interface Session {
    id: string;
    title?: string;
    description?: string;
    hostname: string;
    userAgent: string;
    browserName: string;
    browserVersion: string;
    browserEngineName: string;
    browserEngineVersion: string;
    deviceType: string;
    deviceVendor: string;
    osName: string;
    osVersion: string;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    locale: string;
    startedAt?: ReturnType<Date['toISOString']>;
    internetSpeedInMbps?: number;
    internetLatencyInMs?: number;
    uploaderEmail?: string;
    uploadMethod: 'sdk';
    link?: string;
    videoMimeType?: string;
    videoCodecId?: number;
    videoDuration?: number;
    videoWidth?: string;
    videoHeight?: string;
}

interface RecordedEventTypesOptions {
    click?: boolean;
    keystrokes?: boolean;
    'error-uncaught'?: boolean;
    'error-promise'?: boolean;
    network?: boolean;
    dom?: boolean | object;
    console?:
        | false
        | Partial<{
              debug?: boolean;
              log?: boolean;
              info?: boolean;
              warn?: boolean;
              error?: boolean;
              assert?: boolean;
              trace?: boolean;
              dir?: boolean;
              group?: boolean;
              table?: boolean;
              count?: boolean;
              profile?: boolean;
              time?: boolean;
          }>;
}

export const BIRD_EATS_BUG_PUBLIC_APP_ID =
    process.env.NEXT_PUBLIC_BIRD_EATS_BUG_PUBLIC_APP_ID || 'fa42a80a-1eaf-4784-a286-41999b89c190';

export const birdEatsBugDefaultOptions: (lang: string) => BEGSDKOptions = (lang) => ({
    publicAppId: BIRD_EATS_BUG_PUBLIC_APP_ID,
    instantReplay: true,
    ui: {
        theme: 'light',
        watermark: false,
        previewScreen: {
            title: false,
            email: 'optional',
        },
        defaultButton: {
            icon: false,
        },
        submitConfirmationScreen: {
            sessionLink: true,
        },
        text: lang === zhCN ? birdEatsBugCn : birdEatsBugEn,
    },
});

/* Bird eats bug loading script https://docs.birdeatsbug.com/latest/sdk/installation.html */
export const birdEatsBugScript = (lang: string) => `
    (function(){const birdeatsbug=(window.birdeatsbug=window.birdeatsbug||[]);if(birdeatsbug.initialize)return;if(birdeatsbug.invoked){if(window.console&&console.error){console.error('birdeatsbug snippet included twice.')}return}birdeatsbug.invoked=true;birdeatsbug.methods=['setOptions','trigger','resumeSession','takeScreenshot','startRecording','stopRecording','stopSession','uploadSession','deleteSession'];birdeatsbug.factory=function(method){return function(){const args=Array.prototype.slice.call(arguments);args.unshift(method);birdeatsbug.push(args);return birdeatsbug}};for(let i=0;i<birdeatsbug.methods.length;i++){const key=birdeatsbug.methods[i];birdeatsbug[key]=birdeatsbug.factory(key)}birdeatsbug.load=function(){const script=document.createElement('script');script.type='module';script.async=true;script.src='https://sdk.birdeatsbug.com/v2/core.js';const mountJsBefore=document.getElementsByTagName('script')[0]||document.body.firstChild;mountJsBefore.parentNode.insertBefore(script,mountJsBefore);const style=document.createElement('link');style.rel='stylesheet';style.type='text/css';style.href='https://sdk.birdeatsbug.com/v2/style.css';const mountCssBefore=document.querySelector('link[rel="stylesheet"]')||mountJsBefore;mountCssBefore.parentNode.insertBefore(style,mountCssBefore)};birdeatsbug.load();window.birdeatsbug.setOptions(${JSON.stringify(
        birdEatsBugDefaultOptions(lang),
    )})})();
  `;

export const setBirdEatsBugLanguage = (language: string) => {
    if (window.birdeatsbug?.setOptions) {
        const birdEatsBugOptions = birdEatsBugDefaultOptions(language);
        window.birdeatsbug.setOptions({
            ...birdEatsBugOptions,
            ui: {
                ...birdEatsBugOptions.ui,
                text: language === enUS ? birdEatsBugEn : birdEatsBugCn,
            },
        });
        const button = document.querySelector('#birdeatsbug-default-button');
        if (button) {
            const newText = document.createTextNode(
                language === enUS ? birdEatsBugEn.defaultButton : birdEatsBugCn.defaultButton,
            );
            // replace the text but leave the svg icon
            const oldText = button.firstChild;
            if (oldText) {
                button.replaceChild(newText, oldText);
            } else {
                button.appendChild(newText);
            }
        }
    }
};

export const useBirdEatsBug = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || loaded) {
            return;
        }
        if (window.birdeatsbug?.setOptions || document.getElementById('birdeatsbug-script')) {
            setLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = 'birdeatsbug-script';
        script.async = true;
        const lang = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) || 'zh-CN';
        script.innerHTML = birdEatsBugScript(lang);
        script.onload = () => {
            setLoaded(true);
        };
        document.body.appendChild(script);
    }, [loaded]);
};
