import { IsArray, IsString } from 'class-validator';

export class PostSequenceInfluencerRequest {
    @IsString({
        each: true,
    })
    @IsArray()
    influencers!: string[];
}
