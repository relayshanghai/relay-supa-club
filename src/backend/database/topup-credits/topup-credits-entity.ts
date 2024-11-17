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
import { PlanEntity } from '../plan/plan-entity';
import { PaymentTransactionEntity } from '../payment-transaction/payment-transaction-entity';

@Entity('topup_credits')
export class TopupCreditEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: Relation<CompanyEntity>;

    @ManyToOne(() => PlanEntity)
    @JoinColumn({ name: 'plan_id' })
    plan!: Relation<PlanEntity>;

    @ManyToOne(() => PaymentTransactionEntity)
    @JoinColumn({ name: 'payment_transaction_id' })
    paymentTransaction!: Relation<PaymentTransactionEntity>;

    @Column({ type: 'timestamp', name: 'expired_at' })
    expiredAt!: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;
}
