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
import { SequenceEntity } from './sequence-entity'; // Adjust the import path as necessary

@Entity('template_variables')
export class SequenceTemplateVariableEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ type: 'text', nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: false })
    value!: string;

    @Column({ type: 'text', nullable: false })
    key!: string;

    @ManyToOne(() => SequenceEntity, (sequence) => sequence.templateVariables, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sequence_id' }) // This column is a foreign key to the 'sequences' table
    sequence!: Relation<SequenceEntity>;

    @Column({ type: 'boolean', default: true })
    required!: boolean;
}
