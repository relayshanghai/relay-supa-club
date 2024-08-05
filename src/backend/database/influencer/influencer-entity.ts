import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { InfluencerSocialProfileEntity } from './influencer-social-profile-entity';

@Entity('influencers')
export class InfluencerEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @Column({ name: 'name', type: 'text', nullable: false })
    name!: string;

    @Column({ name: 'email', type: 'text', nullable: true })
    email?: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address?: string;

    @Column({ name: 'avatar_url', type: 'text', nullable: false })
    avatarUrl!: string;

    @Column({ name: 'is_recommended', type: 'boolean', default: false })
    isRecommended!: boolean;

    @OneToMany(() => InfluencerSocialProfileEntity, (socialProfile) => socialProfile.influencer)
    socialProfiles!: InfluencerSocialProfileEntity[];
}
