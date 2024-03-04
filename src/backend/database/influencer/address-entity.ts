import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    type Relation,
} from 'typeorm';
import { InfluencerSocialProfileEntity } from './influencer-social-profile-entity';
import { SequenceInfluencerEntity } from '../sequence/sequence-influencer-entity';

@Entity('addresses')
export class AddressEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ type: 'text', nullable: false })
    country!: string;

    @Column({ type: 'text', nullable: false })
    state!: string;

    @Column({ type: 'text', nullable: false })
    city!: string;

    @Column({ name: 'postal_code', type: 'text', nullable: false })
    postalCode!: string;

    @Column({ name: 'address_line_1', type: 'text', nullable: false })
    addressLine1!: string;

    @Column({ name: 'address_line_2', type: 'text', nullable: true })
    addressLine2?: string;

    @Column({ name: 'tracking_code', type: 'text', nullable: true })
    trackingCode?: string;

    @Column({ name: 'phone_number', type: 'text', nullable: true })
    phoneNumber?: string;

    @Column({ type: 'text', nullable: false })
    name!: string;

    @ManyToOne(() => InfluencerSocialProfileEntity, (influencerSocialProfile) => influencerSocialProfile.addresses, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'influencer_social_profile_id' }) // This column name matches the foreign key in the database.
    influencerSocialProfile?: Relation<InfluencerSocialProfileEntity>;

    @OneToMany(() => SequenceInfluencerEntity, (sequenceInfluencer) => sequenceInfluencer.address, {
        onDelete: 'SET NULL',
    })
    sequenceInfluencers?: SequenceInfluencerEntity[];
}
