const getVal = (imageData: ImageData, i: number) => {
	if (imageData.data[i] === 0x00 && imageData.data[i + 1] === 0x00) return 0;
	if (imageData.data[i] === 0xff && imageData.data[i + 1] === 0xff) return 1;
	if (imageData.data[i] === 0x7f && imageData.data[i + 1] === 0x7f) return 2;
	return 3;
};

const getValFor7color = (imageData: ImageData, i: number) => {
	if (
		imageData.data[i] === 0x00 &&
		imageData.data[i + 1] === 0x00 &&
		imageData.data[i + 2] === 0x00
	)
		return 0;
	if (
		imageData.data[i] === 0xff &&
		imageData.data[i + 1] === 0xff &&
		imageData.data[i + 2] === 0xff
	)
		return 1;
	if (
		imageData.data[i] === 0x00 &&
		imageData.data[i + 1] === 0xff &&
		imageData.data[i + 2] === 0x00
	)
		return 2;
	if (
		imageData.data[i] === 0x00 &&
		imageData.data[i + 1] === 0x00 &&
		imageData.data[i + 2] === 0xff
	)
		return 3;
	if (
		imageData.data[i] === 0xff &&
		imageData.data[i + 1] === 0x00 &&
		imageData.data[i + 2] === 0x00
	)
		return 4;
	if (
		imageData.data[i] === 0xff &&
		imageData.data[i + 1] === 0xff &&
		imageData.data[i + 2] === 0x00
	)
		return 5;
	if (
		imageData.data[i] === 0xff &&
		imageData.data[i + 1] === 0x80 &&
		imageData.data[i + 2] === 0x00
	)
		return 6;
	return 7;
};

const getPos = (x: number, y: number, width: number) => {
	return y * width + x;
};

export const getPixels = (
	canvas: HTMLCanvasElement,
	deviceId: number,
	direction: number,
) => {
	const width = canvas.width;
	const height = canvas.height;
	const imageData = canvas.getContext("2d")!.getImageData(0, 0, width, height);
	const pixels: number[] = new Array(width * height).fill(0);
	let i = 0;
	switch (direction) {
		case 90:
			for (let x = width - 1; x >= 0; x--) {
				for (let y = 0; y < height; y++, i++) {
					if (deviceId === 25 || deviceId === 37) {
						pixels[i] = getValFor7color(imageData, getPos(x, y, width) << 2);
					} else {
						pixels[i] = getVal(imageData, getPos(x, y, width) << 2);
					}
				}
			}
			break;
		case 180:
			for (let y = height - 1; y >= 0; y--) {
				for (let x = width - 1; x >= 0; x--, i++) {
					if (deviceId === 25 || deviceId === 37) {
						pixels[i] = getValFor7color(imageData, getPos(x, y, width) << 2);
					} else {
						pixels[i] = getVal(imageData, getPos(x, y, width) << 2);
					}
				}
			}
			break;
		case 270:
			for (let x = 0; x < width; x++) {
				for (let y = height - 1; y >= 0; y--, i++) {
					if (deviceId === 25 || deviceId === 37) {
						pixels[i] = getValFor7color(imageData, getPos(x, y, width) << 2);
					} else {
						pixels[i] = getVal(imageData, getPos(x, y, width) << 2);
					}
				}
			}
			break;
		default:
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++, i++) {
					if (deviceId === 25 || deviceId === 37) {
						pixels[i] = getValFor7color(imageData, i << 2);
					} else {
						pixels[i] = getVal(imageData, i << 2);
					}
				}
			}
			break;
	}
	return pixels;
};
