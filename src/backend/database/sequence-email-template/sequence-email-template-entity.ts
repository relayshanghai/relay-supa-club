import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    type Relation,
    OneToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { SequenceStepEntity } from '../sequence/sequence-step-entity';
import { OutreachEmailTemplateVariableEntity } from './sequence-email-template-variable-entity';

export enum Step {
    OUTREACH = 'OUTREACH',
    FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',
    SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',
    THIRD_FOLLOW_UP = 'THIRD_FOLLOW_UP',
}

export enum StepNumber {
    OUTREACH = 0,
    FIRST_FOLLOW_UP = 1,
    SECOND_FOLLOW_UP = 2,
    THIRD_FOLLOW_UP = 3,
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

    @ManyToMany(() => OutreachEmailTemplateVariableEntity, (variable) => variable.outreachEmailTemplates)
    @JoinTable({
        name: 'outreach_email_template_variables_relation',
        joinColumn: {
            name: 'outreach_email_template_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'outreach_template_variable_id',
            referencedColumnName: 'id',
        },
    })
    variables?: OutreachEmailTemplateVariableEntity[];
}
