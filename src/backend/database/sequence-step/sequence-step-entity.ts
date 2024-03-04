import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    type Relation,
    JoinColumn,
} from 'typeorm';
import { SequenceEntity } from '../sequence/sequence-entity';
import { OutreachEmailTemplateEntity } from '../sequence-email-template/sequence-email-template-entity';

@Entity('sequence_steps')
export class SequenceStepEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ nullable: true, type: 'text' })
    name!: string;

    @Column({ name: 'wait_time_hours', type: 'integer', nullable: false })
    waitTimeHours!: number;

    @Column({ name: 'template_id', type: 'text', nullable: false })
    templateId!: string;

    @Column({ name: 'step_number', type: 'integer', nullable: false, default: 0 })
    stepNumber!: number;

    @JoinColumn({ name: 'sequence_id' })
    @ManyToOne(() => SequenceEntity, (sequence) => sequence.sequenceSteps)
    sequence?: Relation<SequenceEntity>;

    @JoinColumn({ name: 'outreach_email_template_id' })
    @ManyToOne(() => OutreachEmailTemplateEntity, (sequence) => sequence.sequenceStep)
    outreachEmailTemplate?: Relation<OutreachEmailTemplateEntity>;
}
