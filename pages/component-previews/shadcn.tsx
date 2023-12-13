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

const Shadcn = () => {
    const [switchState, setSwitchState] = useState(false);
    const [checkedState, setCheckedState] = useState(false);
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex w-full justify-between">
                <Button>Useless Button</Button>
                <Calendar />
            </div>
            <div className="flex w-full justify-between">
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button>Open Alert</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex w-full justify-between">
                <section className="flex items-center">
                    <Checkbox
                        onCheckedChange={() => {
                            setCheckedState(!checkedState);
                        }}
                    />
                    {checkedState ? '选中' : '未选中'}
                </section>
                <section className="flex items-center">
                    <Switch
                        onCheckedChange={() => {
                            setSwitchState(!switchState);
                        }}
                    />
                    {switchState ? '开' : '关'}
                </section>
            </div>
            <div className="flex w-full justify-between">
                <section className="flex items-center">
                    <Dialog>
                        <DialogTrigger>
                            <Button>Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove
                                    your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </section>
                <section className="flex items-center">
                    <Input placeholder="请输入" />
                </section>
            </div>
            <div className="flex w-full justify-between">
                <section className="flex items-center">
                    <Sheet>
                        <SheetTrigger>
                            <Button>Open Sheet</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account and remove
                                    your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </section>
                <section className="flex items-center">
                    <Tabs defaultValue="account" className="w-[400px] rounded-lg border-2 p-2">
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">Make changes to your account here.</TabsContent>
                        <TabsContent value="password">Change your password here.</TabsContent>
                    </Tabs>
                </section>
            </div>
        </div>
    );
};

export default Shadcn;
