import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    type Relation,
    OneToMany,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';
import { SequenceInfluencerEntity } from './sequence-influencer-entity';
import { SequenceStepEntity } from './sequence-step-entity';
import { SequenceTemplateVariableEntity } from './sequence-template-variable';
@Entity('sequences')
export class SequenceEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @ManyToOne(() => CompanyEntity, (company) => company.sequences, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'company_id',
    })
    company!: Relation<CompanyEntity>;

    @Column({ name: 'name', type: 'text', nullable: false })
    name!: string;

    @Column({ name: 'auto_start', type: 'boolean', default: false })
    autoStart!: boolean;

    @Column({ name: 'manager_first_name', type: 'text', nullable: true })
    managerFirstName?: string;

    @JoinColumn({ name: 'manager_id', referencedColumnName: 'id' })
    @ManyToOne(() => ProfileEntity, (profile) => profile.sequences, { onDelete: 'CASCADE' })
    manager?: Relation<ProfileEntity>;

    @OneToMany(() => SequenceInfluencerEntity, (sequenceInfluencer) => sequenceInfluencer.sequence, {
        onDelete: 'CASCADE',
    })
    sequenceInfluencers?: Relation<SequenceInfluencerEntity>;

    @Column({ name: 'deleted', type: 'boolean', default: false })
    deleted!: boolean;

    @OneToMany(() => SequenceStepEntity, (sequenceStep) => sequenceStep.sequence, { onDelete: 'CASCADE' })
    steps!: Relation<SequenceStepEntity[]>;

    @OneToMany(() => SequenceTemplateVariableEntity, (variable) => variable.sequence, { onDelete: 'CASCADE' })
    templateVariables!: Relation<SequenceTemplateVariableEntity[]>;
}
