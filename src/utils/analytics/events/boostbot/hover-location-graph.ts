import type { CreatorPlatform } from 'types';
import type { EventPayload, TriggerEvent } from '../../types';

export const HOVER_LOCATION_GRAPH = 'hover-location_graph';

export type HoverLocationGraphPayload = EventPayload<{
    influencer_id: string;
    platform: CreatorPlatform;
    index_position: number;
}>;

export const HoverLocationGraph = (
    trigger: TriggerEvent<HoverLocationGraphPayload>,
    payload?: HoverLocationGraphPayload,
) => trigger(HOVER_LOCATION_GRAPH, payload);

HoverLocationGraph.eventName = <typeof HOVER_LOCATION_GRAPH>HOVER_LOCATION_GRAPH;
