import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
    type Relation,
    Unique,
} from 'typeorm';
import { SequenceInfluencerEntity } from '../sequence/sequence-influencer-entity';
import { EmailEntity } from './email-entity';
import { ThreadContactEntity } from './email-contact-entity';
export enum ThreadStatus {
    UNOPENED = 'unopened',
    OPENED = 'opened',
    CLOSED = 'closed',
}
@Entity('threads')
@Unique('threads_thread_id_key', ['threadId'])
export class ThreadEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'thread_id', type: 'text', nullable: false })
    threadId!: string;

    @OneToOne(() => SequenceInfluencerEntity, (sequenceInfluencer) => sequenceInfluencer.thread)
    @JoinColumn({ name: 'sequence_influencer_id' }) // Ensure you have a join column for the relationship
    sequenceInfluencer?: Relation<SequenceInfluencerEntity>;

    @Column({ name: 'email_engine_account_id', type: 'text', nullable: false })
    emailEngineAccountId!: string;

    @Column({ name: 'last_reply_id', type: 'text', nullable: true })
    lastReplyId?: string;

    @Column({ name: 'last_reply_date', type: 'timestamp with time zone', nullable: true })
    lastReplyDate?: Date;

    @Column({ name: 'thread_status', type: 'text', default: 'unopened', nullable: false })
    threadStatus!: ThreadStatus;

    @Column({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    deletedAt?: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @OneToMany(() => EmailEntity, (email) => email.thread)
    emails?: EmailEntity[];

    @OneToMany(() => ThreadContactEntity, (contact) => contact.thread)
    contacts?: ThreadContactEntity[];
}
