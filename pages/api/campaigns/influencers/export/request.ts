import { IsArray, IsString } from 'class-validator';

export class AddInfluencerRequest {
    @IsString()
    id!: string;
}

export class InfluencerExportRequest {
    @IsArray()
    influencers!: AddInfluencerRequest[];
}
