import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    type Relation,
} from 'typeorm';
import { SequenceEntity } from '../sequence/sequence-entity';

@Entity('template_variables')
export class TemplateVariableEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @Column({ type: 'text', nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: false })
    value!: string;

    @Column({ type: 'text', nullable: false })
    key!: string;

    @JoinColumn({ name: 'sequence_id' })
    @ManyToOne(() => SequenceEntity, (sequence) => sequence.templateVariables, { onDelete: 'CASCADE' })
    sequence!: Relation<SequenceEntity>;

    @Column({ type: 'boolean', nullable: false, default: true })
    required!: boolean;
}
