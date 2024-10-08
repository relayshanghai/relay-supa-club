import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    type Relation,
} from 'typeorm';
import { ProfileEntity } from '../profile/profile-entity';
import { ProductEntity } from '../product/product-entity';
import { OutreachEmailTemplateEntity } from '../sequence-email-template/sequence-email-template-entity';
import { SequenceEntity } from '../sequence/sequence-entity';
import { SequenceInfluencerEntity } from '../sequence/sequence-influencer-entity';
import { SubscriptionEntity } from '../subcription/subscription-entity';

@Entity('companies')
export class CompanyEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column()
    name!: string;

    @Column({ nullable: true })
    website?: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl?: string;

    @Column({ name: 'cus_id', nullable: true })
    cusId?: string;

    @Column({ name: 'searches_limit', default: '' })
    searchesLimit!: string;

    @Column({ name: 'profiles_limit', default: '' })
    profilesLimit!: string;

    @Column({ name: 'subscription_status', default: '' })
    subscriptionStatus!: string;

    @Column({ name: 'trial_searches_limit', default: '' })
    trialSearchesLimit!: string;

    @Column({ name: 'trial_profiles_limit', default: '' })
    trialProfilesLimit!: string;

    @Column({ name: 'subscription_start_date', type: 'timestamp with time zone', nullable: true })
    subscriptionStartDate?: Date;

    @Column({ name: 'subscription_end_date', nullable: true })
    subscriptionEndDate?: string;

    @Column({ name: 'subscription_current_period_start', type: 'timestamp with time zone', nullable: true })
    subscriptionCurrentPeriodStart?: Date;

    @Column({ name: 'subscription_current_period_end', type: 'timestamp with time zone', nullable: true })
    subscriptionCurrentPeriodEnd?: Date;

    @Column({ name: 'ai_email_generator_limit', default: '1000' })
    aiEmailGeneratorLimit!: string;

    @Column({ name: 'trial_ai_email_generator_limit', default: '10' })
    trialAiEmailGeneratorLimit!: string;

    @Column({ nullable: true })
    size?: string;

    @Column({ name: 'terms_accepted' })
    termsAccepted!: boolean;

    @Column({ name: 'subscription_plan', nullable: true })
    subscriptionPlan?: string;

    @OneToMany(() => ProfileEntity, (profile) => profile.company, { cascade: true })
    profiles?: ProfileEntity[];

    @OneToMany(() => ProductEntity, (product) => product.company, { cascade: true })
    products?: ProductEntity[];

    @OneToMany(() => OutreachEmailTemplateEntity, (outreachEmailTemplate) => outreachEmailTemplate.company, {
        cascade: true,
    })
    outreachEmailTemplates?: OutreachEmailTemplateEntity[];

    @OneToMany(() => SequenceEntity, (sequence) => sequence.manager, { cascade: true })
    sequences!: SequenceEntity[];

    @OneToMany(() => SequenceInfluencerEntity, (sequenceInfluencer) => sequenceInfluencer.company, { cascade: true })
    sequenceInfluencers!: SequenceInfluencerEntity[];

    @Column({ name: 'currency', nullable: true })
    currency?: string;

    @OneToOne(() => SubscriptionEntity, (subscription) => subscription.company, { cascade: true })
    subscription?: Relation<SubscriptionEntity>;
}
