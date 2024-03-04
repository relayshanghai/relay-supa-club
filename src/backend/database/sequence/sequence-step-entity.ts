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
import { SequenceEntity } from './sequence-entity';
import { OutreachEmailTemplateEntity } from '../sequence-email-template/sequence-email-template-entity';

@Entity('sequence_steps')
export class SequenceStepEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ type: 'text', nullable: true })
    name?: string;

    @Column({ name: 'wait_time_hours', type: 'int', default: 0 })
    waitTimeHours!: number;

    @Column({ name: 'template_id', type: 'text' })
    templateId!: string;

    @ManyToOne(() => SequenceEntity, (sequence) => sequence.steps, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sequence_id' }) // This column is a foreign key to the 'sequences' table
    sequence!: Relation<SequenceEntity>;

    @Column({ name: 'step_number', type: 'smallint', default: 0 })
    stepNumber!: number;

    @JoinColumn({ name: 'outreach_email_template_id' })
    @ManyToOne(() => OutreachEmailTemplateEntity, (sequence) => sequence.sequenceStep)
    outreachEmailTemplate?: Relation<OutreachEmailTemplateEntity>;
}
