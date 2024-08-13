import { IsEmail, IsString } from 'class-validator';

export class PatchSequenceInfluencerRequest {
    @IsEmail()
    @IsString()
    email!: string;
}
