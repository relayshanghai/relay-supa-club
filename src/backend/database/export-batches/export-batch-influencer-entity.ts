import { Entity, JoinColumn, ManyToOne, type Relation, PrimaryColumn } from 'typeorm';
import { ExportBatchEntity } from './export-batch-entity';

@Entity('export_batch_influencers')
export class ExportBatchInfluencerEntity {
    @ManyToOne(() => ExportBatchEntity, (exportBatch) => exportBatch.id, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'export_batch_id' }) // This column name matches the foreign key in the database.
    exportBatch?: Relation<ExportBatchEntity>;

    @PrimaryColumn({ type: 'text', nullable: false, name: 'iq_data_reference_id' })
    iqDataReferenceId!: string;
}
