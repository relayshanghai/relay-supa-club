import { type IQDataExportResult } from 'src/backend/integration/iqdata/export-definition';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ExportBatchStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Entity('export_batches')
export class ExportBatchEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'iq_data_reference_id', type: 'text', unique: true, nullable: false })
    exportId!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ type: 'text', nullable: false })
    status!: ExportBatchStatus;

    @Column({ type: 'timestamp', nullable: false, name: 'last_completed_at' })
    lastCompletedAt!: Date;

    @Column({ type: 'json', name: 'result' })
    result!: IQDataExportResult[];
}
