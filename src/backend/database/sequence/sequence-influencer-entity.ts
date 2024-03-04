import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    type Relation,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { SequenceEntity } from './sequence-entity';
import { AddressEntity } from '../influencer/address-entity';
import { InfluencerSocialProfileEntity } from '../influencer/influencer-social-profile-entity';
import { ThreadEntity } from '../thread/thread-entity';
import { SequenceEmailEntity } from './sequence-email-entity';

@Entity('sequence_influencers')
export class SequenceInfluencerEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ name: 'added_by', type: 'text', nullable: false })
    addedBy!: string;

    @Column({ name: 'email', type: 'text', nullable: true })
    email?: string;

    @Column({ name: 'sequence_step', type: 'smallint', default: 0, nullable: false })
    sequenceStep!: number;

    @Column({ name: 'funnel_status', type: 'text', nullable: false })
    funnelStatus!: string;

    @Column({ name: 'tags', type: 'text', array: true, default: '{}', nullable: false })
    tags!: string[];

    @Column({ name: 'next_step', type: 'text', nullable: true })
    nextStep?: string;

    @Column({ name: 'scheduled_post_date', type: 'timestamp with time zone', nullable: true })
    scheduledPostDate?: Date;

    @Column({ name: 'video_details', type: 'text', nullable: true })
    videoDetails?: string;

    @Column({ name: 'rate_amount', type: 'double precision', nullable: true })
    rateAmount?: number;

    @Column({ name: 'rate_currency', type: 'text', nullable: true })
    rateCurrency?: string;

    @Column({ name: 'real_full_name', type: 'text', nullable: true })
    realFullName?: string;

    @ManyToOne(() => CompanyEntity, (company) => company.sequenceInfluencers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company!: Relation<CompanyEntity>;

    @ManyToOne(() => SequenceEntity, (sequence) => sequence.sequenceInfluencers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sequence_id' })
    sequence!: Relation<SequenceEntity>;

    @ManyToOne(() => AddressEntity, (address) => address.sequenceInfluencers, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'address_id' })
    address?: Relation<AddressEntity>;

    @ManyToOne(
        () => InfluencerSocialProfileEntity,
        (influencerSocialProfile) => influencerSocialProfile.sequenceInfluencers,
        { onDelete: 'SET NULL' },
    )
    @JoinColumn({ name: 'influencer_social_profile_id' })
    influencerSocialProfile?: Relation<InfluencerSocialProfileEntity>;

    @Column({ name: 'iqdata_id', type: 'text', nullable: false })
    iqdataId!: string;

    @Column({ name: 'avatar_url', type: 'text', nullable: true })
    avatarUrl?: string;

    @Column({ name: 'name', type: 'text', nullable: true })
    name?: string;

    @Column({ name: 'platform', type: 'text', default: 'youtube', nullable: false })
    platform!: string;

    @Column({ name: 'social_profile_last_fetched', type: 'timestamp with time zone', nullable: true })
    socialProfileLastFetched?: Date;

    @Column({ name: 'url', type: 'text', nullable: true })
    url?: string;

    @Column({ name: 'username', type: 'text', nullable: true })
    username?: string;

    @Column({ name: 'affiliate_link', type: 'text', nullable: true })
    affiliateLink?: string;

    @Column({ name: 'commission_rate', type: 'double precision', nullable: true })
    commissionRate?: number;

    @OneToOne(() => ThreadEntity, (thread) => thread.sequenceInfluencer, { onDelete: 'SET NULL' })
    thread?: ThreadEntity;

    @OneToMany(() => SequenceEmailEntity, (sequenceEmail) => sequenceEmail.sequenceInfluencer)
    sequenceEmails!: SequenceEmailEntity[];
}
