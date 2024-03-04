import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    type Relation,
    JoinColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';
import { ProductEntity } from '../product/product-entity';
import { SequenceStepEntity } from '../sequence-step/sequence-step-entity';
import { TemplateVariableEntity } from '../template-variable/template-variable-entity';

@Entity('sequences')
export class SequenceEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ nullable: true, type: 'text' })
    name!: string;

    @Column({ name: 'auto_start', type: 'boolean', default: false })
    autoStart!: boolean;

    @Column({ name: 'manager_first_name', type: 'text', default: false })
    managerFirstName?: string;

    @Column({ name: 'deleted', type: 'boolean', default: false })
    deleted!: boolean;

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => CompanyEntity, (company) => company.sequences)
    company?: Relation<CompanyEntity>;

    @JoinColumn({ name: 'manager_id' })
    @ManyToOne(() => ProfileEntity, (manager) => manager.sequences)
    manager?: Relation<ProfileEntity>;

    @JoinColumn({ name: 'product_id' })
    @OneToOne(() => ProductEntity, (product) => product.sequence)
    product?: Relation<ProductEntity>;

    @OneToMany(() => SequenceStepEntity, (sequenceStep) => sequenceStep.sequence, { cascade: true })
    sequenceSteps?: SequenceStepEntity[];

    @OneToMany(() => TemplateVariableEntity, (templateVariable) => templateVariable.sequence, { cascade: true })
    templateVariables?: TemplateVariableEntity[];
}
