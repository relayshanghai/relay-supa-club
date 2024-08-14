import { IsArray, IsString } from 'class-validator';

export class SendRequest {
    @IsArray()
    sequenceInfluencersIds!: string[];
}

export class SequenceIdParameter {
    @IsString()
    id!: string;
}
