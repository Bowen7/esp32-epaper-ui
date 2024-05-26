import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { SETTING_KEY } from "@/lib/config";
import { devices, type Device } from "@/lib/config";
import { processImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload";

type Props = {
	image: File;
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
	const { image } = props;
	const [imageSize, setImageSize] = useState([0, 0]);
	const [transitUrl, setTransitUrl] = useState("");
	const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
	const transitCanvasRef = useRef<HTMLCanvasElement>(null);
	const targetCanvasRef = useRef<HTMLCanvasElement>(null);
	const [setting] = useLocalStorage(SETTING_KEY, {
		device: "0",
		deviceIP: "",
		direction: "0",
	});
	const { direction, deviceIP } = setting;
	const device = devices[Number.parseInt(setting.device)];
	const [width, height] = getSize(device, Number.parseInt(direction));

	const url = useMemo(() => URL.createObjectURL(image), [image]);

	const onUpload = () => {
		uploadImage(targetCanvasRef.current!, Number(device.id), deviceIP);
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
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		const img = new Image();
		img.src = url;
		img.onload = () => {
			context.drawImage(img, 0, 0, imageSize[0], imageSize[1]);
			// processImage(canvas, transitCanvasRef.current!, device);
			const transitContent = transitCanvasRef.current!.getContext("2d");
			transitContent!.drawImage(
				img,
				0,
				0,
				width,
				(width / imageSize[0]) * imageSize[1],
			);
			setTransitUrl(transitCanvasRef.current!.toDataURL());
		};
	}, [imageSize, url, device]);

	useEffect(() => {
		if (!transitUrl) {
			return;
		}
		const canvas = targetCanvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		const img = new Image();
		img.src = transitUrl;
		img.onload = () => {
			context.clearRect(0, 0, width, height);
			// context.translate(width / 2, height / 2);
			// context.rotate((90 * Math.PI) / 180.0);
			// context.drawImage(
			// 	img,
			// 	0,
			// 	0,
			// 	width,
			// 	(width / imageSize[0]) * imageSize[1],
			// );
			// context.restore();
			processImage(transitCanvasRef.current!, targetCanvasRef.current!, device);
		};
	}, [width, height, transitUrl, imageSize]);

	return (
		<div className="">
			<canvas
				ref={sourceCanvasRef}
				width={imageSize[0]}
				height={imageSize[1]}
			/>
			<canvas
				ref={transitCanvasRef}
				width={width}
				height={height}
				// style={{ display: "none" }}
			/>
			<canvas ref={targetCanvasRef} width={width} height={height} />
			<Button disabled={!deviceIP} onClick={onUpload}>
				Upload
			</Button>
		</div>
	);
};
