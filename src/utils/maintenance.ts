export const isInMaintenance = (page: string) => {
    const maintenancePageList = process.env.NEXT_PUBLIC_MAINTENANCE_PAGE_LIST?.split(',') || [];
    const isMaintenancePage = maintenancePageList.includes(page);
    return isMaintenancePage;
};
