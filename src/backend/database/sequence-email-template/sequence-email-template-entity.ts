import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, type Relation, OneToOne } from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { SequenceStepEntity } from '../sequence/sequence-step-entity';

export enum Step {
    OUTREACH = 'OUTREACH',
    FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',
    SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',
    THIRD_FOLLOW_UP = 'THIRD_FOLLOW_UP',
}

@Entity('outreach_email_templates')
export class OutreachEmailTemplateEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text', nullable: false, default: '' })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: Step, nullable: false }) // Replace with actual enum if more values exist
    step!: Step;

    @Column({ type: 'text', nullable: true })
    template?: string;

    @Column({ type: 'text', nullable: true })
    subject?: string;

    @Column({ type: 'text', nullable: false })
    email_engine_template_id!: string;

    @ManyToOne(() => CompanyEntity, (company) => company.outreachEmailTemplates, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company?: Relation<CompanyEntity>;

    @OneToOne(() => SequenceStepEntity, (sequenceStep) => sequenceStep.outreachEmailTemplate, { onDelete: 'CASCADE' })
    sequenceStep?: Relation<SequenceStepEntity>;
}
