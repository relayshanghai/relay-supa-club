import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';

@Entity({ name: 'billing_events' })
export class BillingEventEntity<T = any> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: CompanyEntity;

    @Column({ default: 'stripe' })
    provider!: string;

    @Column({ name: 'type' })
    type!: string;

    @Column({ name: 'data', type: 'jsonb' })
    data!: T;
}
