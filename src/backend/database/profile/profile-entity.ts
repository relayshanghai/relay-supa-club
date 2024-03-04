import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    type Relation,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { SequenceEntity } from '../sequence/sequence-entity';
import { JobEntity } from '../job/job-entity';

@Entity('profiles')
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl?: string;

    @Column({ nullable: true })
    phone?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => CompanyEntity, (company) => company.profiles)
    company?: Relation<CompanyEntity>;

    @Column({ name: 'last_name' })
    lastName!: string;

    @Column({ name: 'first_name' })
    firstName!: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ name: 'user_role', nullable: true })
    userRole?: string;

    @Column({ name: 'email_engine_account_id', nullable: true })
    emailEngineAccountId?: string;

    @Column({ name: 'sequence_send_email', nullable: true })
    sequenceSendEmail?: string;

    @OneToMany(() => SequenceEntity, (sequence) => sequence.manager)
    sequences?: Relation<SequenceEntity>;

    @OneToMany(() => JobEntity, (job) => job.owner)
    jobs?: Relation<JobEntity>;
}
