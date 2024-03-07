import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    type Relation,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { OutreachEmailTemplateEntity } from './sequence-email-template-entity';

@Entity('outreach_template_variables')
export class OutreachEmailTemplateVariableEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text', nullable: false, default: '' })
    name!: string;

    @Column({ type: 'varchar', nullable: false })
    category!: string;

    @ManyToOne(() => CompanyEntity, (company) => company.outreachEmailTemplates, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company?: Relation<CompanyEntity>;

    @ManyToMany(() => OutreachEmailTemplateEntity, (emailTemplate) => emailTemplate.variables)
    @JoinTable({
        name: 'outreach_email_template_variables_relation',
        joinColumn: {
            name: 'outreach_template_variable_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'outreach_email_template_id',
            referencedColumnName: 'id',
        },
    })
    outreachEmailTemplates?: OutreachEmailTemplateEntity[];
}
