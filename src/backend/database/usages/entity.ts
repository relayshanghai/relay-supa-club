import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    type Relation,
    JoinColumn,
} from 'typeorm';
import { CompanyEntity } from '../company/company-entity';
import { ProfileEntity } from '../profile/profile-entity';

@Entity('usages')
export class UsageEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(() => ProfileEntity)
    profile?: Relation<ProfileEntity>;

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => CompanyEntity)
    company?: Relation<CompanyEntity>;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @Column({ name: 'type' })
    lastName!: string;

    @Column({ name: 'item_id' })
    firstName!: string;
}
