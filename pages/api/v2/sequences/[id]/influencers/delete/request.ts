import { IsArray, IsString } from 'class-validator';

export class DeleteInfluencerRequest {
    @IsString()
    @IsArray()
    influencerIds!: string[];
}
