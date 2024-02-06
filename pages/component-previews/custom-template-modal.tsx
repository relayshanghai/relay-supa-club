import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'shadcn/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcn/components/ui/tabs';

const CustomTemplateModalBody = () => {
    const { t } = useTranslation();
    return (
        <Tabs defaultValue="OUTREACH" className="w-full">
            <TabsList className="flex justify-between">
                <TabsTrigger value="OUTREACH">{t('sequences.steps.Outreach')}</TabsTrigger>
                <TabsTrigger value="FIRST_FOLLOW_UP">{t('sequences.steps.1st Follow-up')}</TabsTrigger>
                <TabsTrigger value="SECOND_FOLLOW_UP">{t('sequences.steps.2nd Follow-up')}</TabsTrigger>
                <TabsTrigger value="THIRD_FOLLOW_UP">{t('sequences.steps.3rd Follow-up')}</TabsTrigger>
            </TabsList>
            <TabsContent value="OUTREACH">Make changes to your account here.</TabsContent>
            <TabsContent value="FIRST_FOLLOW_UP">Change your password here.</TabsContent>
            <TabsContent value="SECOND_FOLLOW_UP">Make changes to your account here.</TabsContent>
            <TabsContent value="THIRD_FOLLOW_UP">Change your password here.</TabsContent>
        </Tabs>
    );
};

const CustomTemplateModal = () => {
    return (
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <p>Email Template Library</p>
                        <p className="text-sm font-normal text-gray-400">Create, view and update your templates here</p>
                    </DialogTitle>
                    <DialogDescription>
                        <CustomTemplateModalBody />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CustomTemplateModal;
