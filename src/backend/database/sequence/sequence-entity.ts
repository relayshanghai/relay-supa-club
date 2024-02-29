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
import { CompanyEntity } from '../company/company-entity';

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

    @JoinColumn({ name: 'manager_id' })
    @ManyToOne(() => CompanyEntity, (company) => company.sequences)
    company?: Relation<CompanyEntity>;
}
