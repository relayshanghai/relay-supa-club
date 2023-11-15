import type { CreatorPlatform } from 'types';
import type { EventPayload, TriggerEvent } from '../../types';

export const HOVER_GENDER_GRAPH = 'hover-gender_graph';

export type HoverGenderGraphPayload = EventPayload<{
    influencer_id: string;
    platform: CreatorPlatform;
    index_position: number;
}>;

export const HoverGenderGraph = (trigger: TriggerEvent<HoverGenderGraphPayload>, payload?: HoverGenderGraphPayload) =>
    trigger(HOVER_GENDER_GRAPH, payload);

HoverGenderGraph.eventName = <typeof HOVER_GENDER_GRAPH>HOVER_GENDER_GRAPH;
