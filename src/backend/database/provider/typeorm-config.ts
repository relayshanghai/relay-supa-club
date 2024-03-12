import type { DataSourceOptions } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';
import { ThreadEntity } from '../thread/thread-entity';
import { SequenceEmailEntity } from '../sequence/sequence-email-entity';
import { SequenceEntity } from '../sequence/sequence-entity';
import { EmailContactEntity, ThreadContactEntity } from '../thread/email-contact-entity';
import { SequenceInfluencerEntity } from '../sequence/sequence-influencer-entity';
import { InfluencerEntity } from '../influencer/influencer-entity';
import { JobEntity } from '../job/job-entity';
import { SequenceStepEntity } from '../sequence/sequence-step-entity';
import { EmailEntity } from '../thread/email-entity';
import { InfluencerSocialProfileEntity } from '../influencer/influencer-social-profile-entity';
import { AddressEntity } from '../influencer/address-entity';
import { SequenceTemplateVariableEntity } from '../sequence/sequence-template-variable';
export const datasourceOptions = (): DataSourceOptions => {
    const url = process.env.SUPABASE_CONNECTION_URL as string;
    if (!url) throw new Error('SUPABASE_CONNECTION_URL is not defined');
    const urlObject = new URL(url);
    return {
        type: 'postgres',
        host: urlObject.hostname,
        port: parseInt(urlObject.port),
        username: urlObject.username,
        password: urlObject.password,
        database: 'postgres',
        schema: 'public',
        entities: [
            CompanyEntity,
            ProfileEntity,
            ThreadEntity,
            SequenceEmailEntity,
            SequenceEntity,
            ThreadEntity,
            ThreadContactEntity,
            EmailContactEntity,
            SequenceInfluencerEntity,
            InfluencerEntity,
            JobEntity,
            SequenceStepEntity,
            EmailEntity,
            SequenceEmailEntity,
            InfluencerSocialProfileEntity,
            AddressEntity,
            SequenceTemplateVariableEntity
        ] as any,
        synchronize: false,
        logger: 'simple-console',
        subscribers: [],
        poolSize: 1,
    };
};
