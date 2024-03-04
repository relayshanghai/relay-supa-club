import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    type Relation,
    Unique,
} from 'typeorm';
import { ThreadEntity } from './thread-entity';

@Entity('emails')
@Unique('emails_email_engine_message_id_key', ['emailEngineId'])
export class EmailEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'jsonb', nullable: false })
    data!: object;

    @Column({ type: 'text', nullable: false })
    sender!: string;

    @Column({ type: 'text', nullable: false })
    recipients!: string;

    @ManyToOne(() => ThreadEntity, (thread) => thread.emails)
    @JoinColumn({ name: 'thread_id', referencedColumnName: 'threadId' }) // This column should match the foreign key in the database.
    thread!: Relation<ThreadEntity>;

    @Column({ name: 'email_engine_message_id', type: 'text', nullable: false })
    emailEngineMessageId!: string;

    @Column({ name: 'email_engine_id', type: 'text', nullable: false })
    emailEngineId!: string;

    @Column({ name: 'email_engine_account_id', type: 'text', nullable: false })
    emailEngineAccountId!: string;

    @Column({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    deletedAt?: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;
}
