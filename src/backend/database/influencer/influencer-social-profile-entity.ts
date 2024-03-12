import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    type Relation,
} from 'typeorm';
import { InfluencerEntity } from './influencer-entity';
import { AddressEntity } from './address-entity';
import { SequenceInfluencerEntity } from '../sequence/sequence-influencer-entity';

@Entity('influencer_social_profiles')
export class InfluencerSocialProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @Column({ type: 'text', nullable: false })
    url!: string;

    // Assuming CREATOR_PLATFORM_OPTIONS is an array of strings defining valid platform options.
    // In TypeORM, enum can be used directly if the database supports it, or string can be used with manual validation.
    @Column({ type: 'text', nullable: false, default: 'youtube' })
    platform!: string;

    @Column({ name: 'influencer_id', type: 'uuid', nullable: false })
    influencerId!: string;

    @ManyToOne(() => InfluencerEntity, (influencer) => influencer.socialProfiles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'influencer_id' })
    influencer!: InfluencerEntity;

    @Column({ type: 'text', name: 'reference_id', nullable: false })
    referenceId!: string;

    @Column({ type: 'text', nullable: false })
    username!: string;

    @Column({ type: 'text', nullable: true })
    email?: string;

    @Column({ type: 'text', nullable: true })
    name?: string;

    @Column({ name: 'avatar_url', type: 'text', nullable: true })
    avatarUrl?: string;

    @Column({ name: 'recent_post_title', type: 'text', nullable: true })
    recentPostTitle?: string;

    @Column({ name: 'recent_post_url', type: 'text', nullable: true })
    recentPostUrl?: string;

    @Column({ name: 'data', type: 'jsonb', nullable: true })
    data?: object;
    // @ts-ignore
    @Column({ name: 'topic_tags', type: 'jsonb', nullable: true, transformer: {
        from(value: object) {
            if (typeof value === 'string') return JSON.parse(value);
            return value;
        }
    } })
    topicTags?: object[];

    @Column({ name: 'topics_relevances', type: 'jsonb', nullable: true })
    topicsRelevances?: object[];

    @OneToMany(() => AddressEntity, (address) => address.influencerSocialProfile)
    addresses!: Relation<AddressEntity>[];

    @OneToMany(() => SequenceInfluencerEntity, (sequenceInfluencer) => sequenceInfluencer.influencerSocialProfile)
    sequenceInfluencers!: Relation<SequenceInfluencerEntity>[];
}
