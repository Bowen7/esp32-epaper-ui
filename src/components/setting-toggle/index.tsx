import { useState } from "react";
import { GearIcon, PinTopIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { devices } from "@/lib/config";
import { settingsAtom } from "@/lib/atom";

export type Setting = {
	device: string;
	deviceIP: string;
	direction: string;
};

export const DEFAULT_SETTING: Setting = {
	device: "0",
	deviceIP: "",
	direction: "0",
};

export function SettingToggle() {
	const [open, setOpen] = useState(false);
	const [setting, setSetting] = useAtom(settingsAtom);

	const form = useForm<Setting>({
		defaultValues: setting,
	});

	const onSubmit = (values: Setting) => {
		setSetting(values);
		setOpen(false);
	};

	const onOpenChange = (open: boolean) => {
		setOpen(open);
		if (open) {
			form.reset(setting);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<GearIcon className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Setting</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="device"
							render={({ field }) => (
								<>
									<FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
										<FormLabel className="text-right">Device</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger className="col-span-3">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{devices.map((device) => (
														<SelectItem key={device.id} value={device.id}>
															{device.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								</>
							)}
						/>
						<FormField
							control={form.control}
							name="deviceIP"
							render={({ field }) => (
								<>
									<FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
										<FormLabel className="text-right">Device IP</FormLabel>
										<FormControl>
											<Input {...field} className="col-span-3" />
										</FormControl>
									</FormItem>
								</>
							)}
						/>
						<FormField
							control={form.control}
							name="direction"
							render={({ field }) => (
								<>
									<FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
										<FormLabel className="text-right">Direction</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger className="col-span-3">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="0">
														<div className="flex items-center space-x-2">
															<PinTopIcon />
															<span>0°</span>
														</div>
													</SelectItem>
													<SelectItem value="90">
														<div className="flex items-center space-x-2">
															<PinTopIcon className="rotate-90" />
															<span>90°</span>
														</div>
													</SelectItem>
													<SelectItem value="180">
														<div className="flex items-center space-x-2">
															<PinTopIcon className="rotate-180" />
															<span>180°</span>
														</div>
													</SelectItem>
													<SelectItem value="270">
														<div className="flex items-center space-x-2">
															<PinTopIcon className="rotate-[270deg]" />
															<span>270°</span>
														</div>
													</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								</>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={!form.getValues().deviceIP}>
								Save changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
