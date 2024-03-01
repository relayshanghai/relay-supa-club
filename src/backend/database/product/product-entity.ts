import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    type Relation,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ name: 'shop_url', type: 'text', nullable: true })
    shopUrl?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'double precision', nullable: true })
    price?: number;

    @Column({ name: 'price_currency', type: 'text', nullable: true })
    priceCurrency?: string;

    @Column({ name: 'name', type: 'character varying', default: '' })
    name!: string;

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => CompanyEntity, (company) => company.products)
    company?: Relation<CompanyEntity>;
}
