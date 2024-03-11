import type { DataSourceOptions } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';
import { ProductEntity } from '../product/product-entity';
import { OutreachEmailTemplateEntity } from '../sequence-email-template/sequence-email-template-entity';
import { TemplateVariableEntity } from '../template-variable/template-variable-entity';
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
import { OutreachEmailTemplateVariableEntity } from '../sequence-email-template/sequence-email-template-variable-entity';
import { SubscriptionEntity } from '../subcription/subscription-entity';
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
            ProductEntity,
            SequenceStepEntity,
            OutreachEmailTemplateEntity,
            TemplateVariableEntity,
            SequenceEntity,
            ThreadEntity,
            ThreadContactEntity,
            EmailContactEntity,
            SequenceInfluencerEntity,
            InfluencerEntity,
            JobEntity,
            EmailEntity,
            SequenceEmailEntity,
            InfluencerSocialProfileEntity,
            AddressEntity,
            OutreachEmailTemplateVariableEntity,
            SubscriptionEntity,
        ] as any,
        synchronize: false,
        logger: 'simple-console',
        subscribers: [],
        poolSize: 1,
    };
};
