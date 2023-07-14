import type { EventPayload, TriggerEvent } from '../types';

export const REPORT = 'report';

export type ReportPayload = EventPayload;

export const Report = (trigger: TriggerEvent<ReportPayload>, payload?: ReportPayload) => trigger(REPORT, payload);

export type Report = typeof Report;

Report.eventName = REPORT;
