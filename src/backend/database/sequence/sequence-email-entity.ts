import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    type Relation,
} from 'typeorm';
import { SequenceInfluencerEntity } from './sequence-influencer-entity';
import { JobEntity } from '../job/job-entity';
import { SequenceStepEntity } from './sequence-step-entity';
import { SequenceEntity } from './sequence-entity';

@Entity('sequence_emails')
export class SequenceEmailEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ name: 'email_send_at', type: 'timestamp with time zone', nullable: true })
    emailSendAt?: Date;

    @Column({ name: 'email_message_id', type: 'text', nullable: true })
    emailMessageId?: string;

    @Column({ name: 'email_delivery_status', type: 'text', nullable: true })
    emailDeliveryStatus?: string;

    @Column({ name: 'email_tracking_status', type: 'text', nullable: true })
    emailTrackingStatus?: string;

    @ManyToOne(() => SequenceInfluencerEntity, (sequenceInfluencer) => sequenceInfluencer.sequenceEmails, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'sequence_influencer_id' })
    sequenceInfluencer!: Relation<SequenceInfluencerEntity>;

    @ManyToOne(() => SequenceStepEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sequence_step_id' })
    sequenceStep!: Relation<SequenceStepEntity>;

    @ManyToOne(() => SequenceEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sequence_id' })
    sequence?: Relation<SequenceEntity>;

    @Column({ name: 'email_engine_account_id', type: 'text', nullable: true })
    emailEngineAccountId?: string;

    @ManyToOne(() => JobEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'job_id' })
    job?: JobEntity;
}
