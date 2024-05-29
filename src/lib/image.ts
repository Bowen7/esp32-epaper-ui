import type { ImageOptions } from "./atom";

export const calcImageRect = (
	imageSize: [number, number],
	deviceSize: [number, number],
	options: ImageOptions,
) => {
	const [imageWidth, imageHeight] = imageSize;
	const [deviceWidth, deviceHeight] = deviceSize;
	const { size, verticalAlign, horizontalAlign } = options;

	const imageRatio = imageWidth / imageHeight;
	const deviceRatio = deviceWidth / deviceHeight;

	let width = 0;
	let height = 0;
	let x = 0;
	let y = 0;

	switch (size) {
		case "original":
			width = imageWidth;
			height = imageHeight;
			break;
		case "contain":
			if (deviceRatio > imageRatio) {
				width = deviceHeight * imageRatio;
				height = deviceHeight;
			} else {
				width = deviceWidth;
				height = deviceWidth / imageRatio;
			}
			break;
		case "cover":
			if (deviceRatio > imageRatio) {
				width = deviceWidth;
				height = deviceWidth / imageRatio;
			} else {
				width = deviceHeight * imageRatio;
				height = deviceHeight;
			}
			break;
	}

	switch (horizontalAlign) {
		case "left":
			x = 0;
			break;
		case "center":
			x = (deviceWidth - width) / 2;
			break;
		case "right":
			x = deviceWidth - width;
			break;
	}

	switch (verticalAlign) {
		case "top":
			y = 0;
			break;
		case "center":
			y = (deviceHeight - height) / 2;
			break;
		case "bottom":
			y = deviceHeight - height;
			break;
	}

	if (x < 0) {
		x = 0;
	}
	if (y < 0) {
		y = 0;
	}

	return { x, y, width, height };
};
