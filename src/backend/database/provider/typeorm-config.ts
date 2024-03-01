import type { DataSourceOptions } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';
import { ProductEntity } from '../product/product-entity';
import { SequenceEntity } from '../sequence/sequence-entity';
import { SequenceStepEntity } from '../sequence-step/sequence-step-entity';
import { OutreachEmailTemplateEntity } from '../sequence-email-template/sequence-email-template-entity';
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
            SequenceEntity,
            SequenceStepEntity,
            OutreachEmailTemplateEntity,
            __dirname + '../**/*entity{.ts,.js}',
        ],
        synchronize: false,
        logger: 'simple-console',
        subscribers: [],
        poolSize: 1,
    };
};
