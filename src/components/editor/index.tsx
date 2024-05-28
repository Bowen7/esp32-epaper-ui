import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import useDimensions from "react-cool-dimensions";
import { ArrowLeftIcon, UploadIcon } from "@radix-ui/react-icons";
import { SETTING_KEY } from "@/lib/config";
import { devices, type Device } from "@/lib/config";
import { ditherImage } from "@/lib/dither";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload";
import {
	defaultImageOptions,
	calcImageRect,
	type ImageOptions,
} from "@/lib/image";

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

const options: ImageOptions = {
	size: "cover",
	verticalAlign: "center",
	horizontalAlign: "center",
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
	const [setting] = useLocalStorage(SETTING_KEY, {
		device: "0",
		deviceIP: "",
		direction: "0",
	});

	const { observe: observeSource, width: sourceContainerW } = useDimensions();
	const { observe: observeTarget, width: targetContainerW } = useDimensions();

	const { direction, deviceIP } = setting;
	const device = devices[Number.parseInt(setting.device)];
	const [width, height] = getSize(device, Number.parseInt(direction));

	const maxCanvasHeight = Math.max(
		imageSize[1] * sourceContainerScale,
		height * targetContainerScale,
	);

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
			const rect = calcImageRect(imageSize, [width, height], options);
			console.log(imageSize, [width, height], rect);
			transitContext!.clearRect(0, 0, width, height);
			transitContext!.drawImage(img, rect.x, rect.y, rect.width, rect.height);
			setTransitUrl(transitCanvasRef.current!.toDataURL());
		};
	}, [imageSize, url, width, height]);

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
			<div className="mt-8 flex justify-end space-x-4">
				<Button onClick={onBack} variant="outline">
					<ArrowLeftIcon />
					Back
				</Button>
				<Button disabled={!deviceIP} onClick={onUpload}>
					<UploadIcon />
					Upload
				</Button>
			</div>
		</div>
	);
};
