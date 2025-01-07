import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PriceType {
    TOP_UP = 'top-up',
    SUBSCRIPTION = 'subscription',
}

export enum Currency {
    USD = 'usd',
    CNY = 'cny',
}

export enum BillingPeriod {
    ONE_TIME = 'one-time',
    MONTHLY = 'monthly',
    ANNUALLY = 'annually',
}

@Entity('plans')
export class PlanEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, name: 'item_name' })
    itemName!: string;

    @Column({ type: 'varchar', length: 255, name: 'price_type' })
    priceType!: PriceType;

    @Column({ type: 'varchar', length: 10, name: 'currency' })
    currency!: Currency;

    @Column({ type: 'varchar', length: 10, name: 'billing_period' })
    billingPeriod!: BillingPeriod;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'price' })
    price!: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'original_price' })
    originalPrice?: number | null;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'existing_user_price' })
    existingUserPrice?: number | null;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'price_id' })
    priceId!: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'original_price_id' })
    originalPriceId?: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'existing_user_price_id' })
    existingUserPriceId?: string | null;

    @Column({ type: 'int', name: 'profiles' })
    profiles!: number;

    @Column({ type: 'int', name: 'searches' })
    searches!: number;

    @Column({ type: 'int', name: 'exports' })
    exports!: number;

    @Column({ type: 'boolean', name: 'is_active' })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;
}
