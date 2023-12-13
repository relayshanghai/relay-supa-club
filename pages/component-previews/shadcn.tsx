import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from 'shadcn/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Button } from 'shadcn/components/ui/button';
import { Calendar } from 'shadcn/components/ui/calendar';
import { Checkbox } from 'shadcn/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'shadcn/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from 'shadcn/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shadcn/components/ui/tabs';
import { Input } from 'shadcn/components/ui/input';
import { Switch } from 'shadcn/components/ui/switch';

const PreviewButton = () => {
    return <Button>Useless Button</Button>;
};

const PreviewCalendar = () => {
    return <Calendar />;
};

const PreviewAlertDialog = () => {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button>Open Alert</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const PreviewAvatar = () => {
    return (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
};

const PreviewCheckbox = () => {
    const [checkedState, setCheckedState] = useState(false);
    return (
        <>
            <Checkbox
                onCheckedChange={() => {
                    setCheckedState(!checkedState);
                }}
            />
            {checkedState ? 'Checked' : 'Unchecked'}
        </>
    );
};

const PreviewDialog = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

const PreviewInput = () => {
    return (
        <Input className=" focus:border-primary-400 focus-visible:ring-primary-400" placeholder="Placeholder Text" />
    );
};

const PreviewSheet = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

const PreviewSwitch = () => {
    const [switchState, setSwitchState] = useState(false);
    return (
        <>
            <Switch
                onCheckedChange={() => {
                    setSwitchState(!switchState);
                }}
            />
            {switchState ? 'Switch on' : 'Switch off'}
        </>
    );
};

const PreviewTabs = () => {
    return (
        <Tabs defaultValue="account" className="w-[400px] rounded-lg border-2 p-2">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
    );
};

const previewComponents = [
    {
        name: 'Button',
        component: PreviewButton,
    },
    {
        name: 'Calendar',
        component: PreviewCalendar,
    },
    {
        name: 'AlertDialog',
        component: PreviewAlertDialog,
    },
    {
        name: 'Avatar',
        component: PreviewAvatar,
    },
    {
        name: 'Checkbox',
        component: PreviewCheckbox,
    },
    {
        name: 'Dialog',
        component: PreviewDialog,
    },
    {
        name: 'Input',
        component: PreviewInput,
    },
    {
        name: 'Sheet',
        component: PreviewSheet,
    },
    {
        name: 'Switch',
        component: PreviewSwitch,
    },
    {
        name: 'Tabs',
        component: PreviewTabs,
    },
];

const Shadcn = () => {
    return (
        <div className="grid grid-cols-2 gap-8 p-4">
            {previewComponents.map(({ name, component }) => (
                <section key={`previewcomponent-${name}`} className="h-full w-full">
                    {name}
                    <section className="flex h-full w-full items-center justify-center rounded-xl border-2 p-2">
                        {component()}
                    </section>
                </section>
            ))}
        </div>
    );
};

export default Shadcn;
