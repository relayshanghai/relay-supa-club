import { IsArray } from 'class-validator';

export class SendRequest {
    @IsArray()
    sequenceInfluencersIds!: string[];
}
