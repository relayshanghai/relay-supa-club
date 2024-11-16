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
import { CompanyEntity } from '../company/company-entity';
import { type Nullable } from 'types/nullable';

@Entity('payment_transactions')
export class PaymentTransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: Relation<CompanyEntity>;

    @Column({ type: 'varchar', name: 'provider_transaction_id' })
    providerTransactionId!: string;

    @Column({ type: 'timestamp', name: 'paid_at', nullable: true })
    paidAt?: Nullable<Date>;

    @Column({ type: 'timestamp', name: 'cancelled_at', nullable: true })
    cancelledAt?: Nullable<Date>;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;
}
