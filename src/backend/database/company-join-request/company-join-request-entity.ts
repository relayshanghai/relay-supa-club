import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    type Relation,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';

@Entity('company_join_requests')
export class CompanyJoinRequestEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => CompanyEntity)
    company?: Relation<CompanyEntity>;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(() => ProfileEntity)
    profile?: Relation<ProfileEntity>;

    @Column({ type: 'timestamp', name: 'joined_at', nullable: true })
    joinedAt!: Date;

    @Column({ type: 'timestamp', name: 'ignored_at', nullable: true })
    ignoredAt!: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;
}
