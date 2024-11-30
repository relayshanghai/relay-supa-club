import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    JoinColumn,
    ManyToOne,
    type Relation,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';

export enum BalanceType {
    SEARCH = 'search',
    PROFILE = 'profile',
    EXPORT = 'export',
}
@Entity('balances')
export class BalanceEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => CompanyEntity, (company) => company.products)
    company?: Relation<CompanyEntity>;

    @Column({ name: 'amount', type: 'double precision', nullable: true })
    amount!: number;

    @Column({ name: 'balance_type', type: 'text' })
    type!: BalanceType;
}
