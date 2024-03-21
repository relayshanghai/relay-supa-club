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

export interface EmailContact {
    name?: string;
    address: string;
}

interface EmailHeader {
    from: string[];
    subject: string[];
}

interface EmailTextContent {
    id?: string;
    plain?: string;
    html: string;
    encodedSize?: {
        plain: number;
        html: number;
    };
    hasMore?: boolean;
}

export interface EmailAttachment {
    id: string;
    inline: boolean;
    embedded: boolean;
    filename: string;
    contentId: string;
    contentType: string;
    encodedSize: number;
}
export interface Email {
    path: string;
    specialUse: string;
    id: string;
    uid: number;
    emailId: string;
    threadId: string;
    date: Date;
    flags: string[];
    labels: string[];
    size: number;
    subject: string;
    from: EmailContact;
    replyTo: EmailContact[];
    sender: EmailContact;
    to: EmailContact[];
    cc: EmailContact[];
    messageId: string;
    headers: EmailHeader;
    text: EmailTextContent;
    messageSpecialUse: string;
    unseen: boolean;
    attachments: EmailAttachment[];
}
@Entity('emails')
@Unique('emails_email_engine_message_id_key', ['emailEngineId'])
export class EmailEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        // @ts-ignore
        type: 'jsonb',
        nullable: false,
        transformer: {
            from(value: object) {
                if (typeof value === 'string') return JSON.parse(value);
                return value;
            },
            to(value: object) {
                return JSON.stringify(value);
            },
        },
    })
    data!: Email;

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
