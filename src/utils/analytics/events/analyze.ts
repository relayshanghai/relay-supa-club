import type { EventPayload, TriggerEvent } from '../types';

export const ANALYZE = 'analyze';

export type AnalyzePayload = EventPayload;

export const Analyze = (trigger: TriggerEvent<AnalyzePayload>, payload?: AnalyzePayload) => trigger(ANALYZE, payload);

export type Analyze = typeof Analyze;

Analyze.eventName = ANALYZE;
