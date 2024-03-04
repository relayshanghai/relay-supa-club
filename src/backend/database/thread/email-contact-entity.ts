import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique,
    ManyToOne,
    JoinColumn,
    type Relation,
    OneToMany,
} from 'typeorm';
import { ThreadEntity } from './thread-entity';
export enum ThreadContactType {
    FROM = 'from',
    TO = 'to',
    CC = 'cc',
    BCC = 'bcc',
}
@Entity('email_contacts')
@Unique('email_contacts_address_key', ['address'])
export class EmailContactEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: false })
    address!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @OneToMany(() => ThreadContactEntity, (threadContact) => threadContact.emailContact)
    threadContacts?: ThreadContactEntity[];
}

@Entity('thread_contacts')
export class ThreadContactEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => ThreadEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'thread_id', referencedColumnName: 'threadId' })
    thread!: Relation<ThreadEntity>;

    @ManyToOne(() => EmailContactEntity, { onDelete: 'CASCADE' }) // Assuming CASCADE or SET NULL based on your requirement
    @JoinColumn({ name: 'email_contact_id' })
    emailContact!: EmailContactEntity;

    @Column({ type: 'text', nullable: true })
    type?: ThreadContactType;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @Column({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    deletedAt?: Date;
}
