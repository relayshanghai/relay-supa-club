import type { RelayDatabase, ReportSnapshots } from '../types';

export const insertReportSnapshot = (db: RelayDatabase) => async (data: ReportSnapshots['Insert']) => {
    const result = await db.from('report_snapshots').insert(data).select().single();
    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const updateReportSnapshot = (db: RelayDatabase) => async (data: ReportSnapshots['Update'], id: string) => {
    const result = await db.from('report_snapshots').update(data).eq('id', id).select().single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const getReportSnapshot = (db: RelayDatabase) => async (id: string) => {
    const result = await db.from('report_snapshots').select().eq('id', id).maybeSingle();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};
