import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    type Relation,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';

export enum CompanyPromos {
    BEFORE_JULY = 'BEFORE_JULY',
}

@Entity({ name: 'company_promos' })
export class CompanyPromoEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    company!: Relation<CompanyEntity>;

    @Column()
    promo!: CompanyPromos;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;
}
