import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    type Relation,
} from 'typeorm';
import { ProfileEntity } from '../profile/profile-entity';

export enum JobQueueType {
    SEQUENCE_STEP_SEND = 'sequence_step_send',
}

@Entity('jobs')
@Index('idx_createdat_runat_status_queue', ['queue', 'runAt', 'status', 'createdAt'])
@Index('idx_status_queue_owner', ['queue', 'status', 'owner'])
export class JobEntity<TPayload = object, TResult = object> {
    constructor(data: Partial<JobEntity<TPayload, TResult>>) {
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text', nullable: false })
    name!: string;

    @Column({ type: 'text', default: 'default' })
    queue!: JobQueueType;

    @Column({ name: 'run_at', type: 'timestamp with time zone', nullable: false })
    runAt!: Date;

    @Column({ type: 'json', default: '{}' })
    payload!: TPayload;

    @Column({ type: 'text', default: 'pending' })
    status!: string;

    @Column({ type: 'json', nullable: true })
    result?: TResult;

    @ManyToOne(() => ProfileEntity, (profile) => profile.jobs, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'owner' }) // Adjust based on your Profile entity definition
    owner?: Relation<ProfileEntity>;

    @Column({ name: 'retry_count', type: 'bigint', default: '0' })
    retryCount!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;
}
