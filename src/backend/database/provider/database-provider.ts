import { DataSource } from 'typeorm';
import { datasourceOptions } from './typeorm-config';

export class DatabaseProvider {
    static datasource: NonNullable<DataSource>;
    static getDatasource = () => {
        if (!DatabaseProvider.datasource) {
            DatabaseProvider.datasource = new DataSource(datasourceOptions());
        }
        return DatabaseProvider.datasource;
    };
    static async initialize() {
        const datasource = DatabaseProvider.getDatasource();
        if (!datasource.isInitialized) {
            await DatabaseProvider.getDatasource().initialize();
        }
    }
    static async close() {
        const datasource = DatabaseProvider.getDatasource();
        datasource.manager.connection.destroy();
    }
}
