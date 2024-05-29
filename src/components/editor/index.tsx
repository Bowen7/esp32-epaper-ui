import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import useDimensions from "react-cool-dimensions";
import {
	ArrowLeftIcon,
	UploadIcon,
	AlignCenterHorizontallyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	AlignCenterVerticallyIcon,
	AlignTopIcon,
	AlignBottomIcon,
} from "@radix-ui/react-icons";
import { Gauge } from "@suyalcinkaya/gauge";
import { SETTING_KEY, IMAGE_OPTIONS_KEY } from "@/lib/config";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { devices, type Device } from "@/lib/config";
import { ditherImage } from "@/lib/dither";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload";
import { DEFAULT_SETTING } from "@/components/setting-toggle";
import {
	defaultImageOptions,
	calcImageRect,
	type ImageOptions,
} from "@/lib/image";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

type Props = {
	url: string;
	onBack: () => void;
};
const getSize = (device: Device, direction: number): [number, number] => {
	const { width, height } = device;
	switch (direction) {
		case 90:
		case 270:
			return [device.height, device.width];
		default:
			return [width, height];
	}
};

export const Editor = (props: Props) => {
	const { url, onBack } = props;
	const [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
	const [transitUrl, setTransitUrl] = useState("");
	const [sourceContainerScale, setSourceContainerScale] = useState(1);
	const [targetContainerScale, setTargetContainerScale] = useState(1);
	const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
	const transitCanvasRef = useRef<HTMLCanvasElement>(null);
	const targetCanvasRef = useRef<HTMLCanvasElement>(null);
	const [setting] = useLocalStorage(SETTING_KEY, DEFAULT_SETTING);
	const [imageOptions, setImageOptions] = useLocalStorage<ImageOptions>(
		IMAGE_OPTIONS_KEY,
		defaultImageOptions,
	);

	const { observe: observeSource, width: sourceContainerW } = useDimensions();
	const { observe: observeTarget, width: targetContainerW } = useDimensions();

	const { direction, deviceIP } = setting;
	const device = devices[Number.parseInt(setting.device)];
	const [width, height] = getSize(device, Number.parseInt(direction));

	const maxCanvasHeight = Math.max(
		imageSize[1] * sourceContainerScale,
		height * targetContainerScale,
	);

	const onImageOptionsChange = (key: keyof ImageOptions, value: string) => {
		setImageOptions((prev) => ({
			...prev,
			[key]: value as ImageOptions[typeof key],
		}));
	};

	useEffect(() => {
		if (sourceContainerW < imageSize[0]) {
			setSourceContainerScale(sourceContainerW / imageSize[0]);
		} else {
			setSourceContainerScale(1);
		}
	}, [sourceContainerW, imageSize]);

	useEffect(() => {
		if (targetContainerW < width) {
			setTargetContainerScale(targetContainerW / width);
		} else {
			setTargetContainerScale(1);
		}
	}, [targetContainerW, width]);

	const onUpload = () => {
		uploadImage(
			targetCanvasRef.current!,
			Number(device.id),
			deviceIP,
			Number(direction),
		);
	};

	useEffect(() => {
		const img = new Image();
		img.src = url;
		img.onload = () => {
			setImageSize([img.width, img.height]);
		};
	}, [url]);

	useEffect(() => {
		const canvas = sourceCanvasRef.current;
		const context = canvas!.getContext("2d")!;
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = url;
		img.onload = () => {
			context.drawImage(img, 0, 0, imageSize[0], imageSize[1]);
			const transitContext = transitCanvasRef.current!.getContext("2d");
			const rect = calcImageRect(imageSize, [width, height], imageOptions);
			transitContext!.clearRect(0, 0, width, height);
			transitContext!.drawImage(img, rect.x, rect.y, rect.width, rect.height);
			setTransitUrl(transitCanvasRef.current!.toDataURL());
		};
	}, [imageSize, url, width, height, imageOptions]);

	useEffect(() => {
		if (!transitUrl) {
			return;
		}
		const canvas = targetCanvasRef.current;
		const context = canvas!.getContext("2d")!;
		const img = new Image();
		img.src = transitUrl;
		img.onload = () => {
			context.clearRect(0, 0, width, height);
			ditherImage(transitCanvasRef.current!, targetCanvasRef.current!, device);
		};
	}, [width, height, transitUrl, device]);

	return (
		<div className="w-full px-8">
			<div className="grid grid-cols-2 gap-4 overflow-hidden mt-4 mb-2">
				<div className="text-lg font-semibold">Original Image</div>
				<div className="text-lg font-semibold">Processed Image</div>
			</div>
			<div
				className="grid grid-cols-2 gap-4 overflow-hidden"
				style={{ height: `${maxCanvasHeight}px` }}
			>
				<div ref={observeSource}>
					<canvas
						className="origin-top-left shadow-lg"
						ref={sourceCanvasRef}
						width={imageSize[0]}
						height={imageSize[1]}
						style={{ transform: `scale(${sourceContainerScale})` }}
					/>
				</div>
				<canvas
					ref={transitCanvasRef}
					className="hidden"
					width={width}
					height={height}
				/>
				<div ref={observeTarget}>
					<canvas
						className="origin-top-left shadow-lg"
						ref={targetCanvasRef}
						width={width}
						height={height}
						style={{ transform: `scale(${targetContainerScale})` }}
					/>
				</div>
			</div>
			<div className="flex space-x-8 mt-8">
				<div className="flex flex-col items-start space-y-2">
					<Label>Image Size</Label>
					<Select
						onValueChange={(value) => onImageOptionsChange("size", value)}
						defaultValue={imageOptions.size}
					>
						<SelectTrigger className="w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="original">Original</SelectItem>
							<SelectItem value="contain">Contain</SelectItem>
							<SelectItem value="cover">Cover</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col items-start space-y-2">
					<Label>Horizontal Align</Label>
					<ToggleGroup
						type="single"
						value={imageOptions.horizontalAlign}
						onValueChange={(value) =>
							onImageOptionsChange("horizontalAlign", value)
						}
					>
						<ToggleGroupItem value="left">
							<AlignLeftIcon />
						</ToggleGroupItem>
						<ToggleGroupItem value="center">
							<AlignCenterHorizontallyIcon />
						</ToggleGroupItem>
						<ToggleGroupItem value="right">
							<AlignRightIcon />
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<div className="flex flex-col items-start space-y-2">
					<Label>Vertical Align</Label>
					<ToggleGroup
						type="single"
						value={imageOptions.verticalAlign}
						onValueChange={(value) =>
							onImageOptionsChange("verticalAlign", value)
						}
					>
						<ToggleGroupItem value="top">
							<AlignTopIcon />
						</ToggleGroupItem>
						<ToggleGroupItem value="center">
							<AlignCenterVerticallyIcon />
						</ToggleGroupItem>
						<ToggleGroupItem value="bottom">
							<AlignBottomIcon />
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>
			<div className="mt-8 flex justify-end space-x-4">
				<Button onClick={onBack} variant="outline">
					<ArrowLeftIcon />
					Back
				</Button>
				<Button disabled={!deviceIP} onClick={onUpload}>
					{/* <UploadIcon /> */}
					<Gauge value={100} size={"xm"} className="mr-2" />
					Upload
				</Button>
			</div>
		</div>
	);
};
