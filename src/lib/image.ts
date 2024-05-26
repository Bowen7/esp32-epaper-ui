import { type Device, type Palette, type Color, palettes } from "./config";

// from https://github.com/danielepiccone/ditherjs/blob/master/lib/algorithms/errorDiffusionDither.js
const colorDistance = (a: Color, b: Color) => {
	return Math.sqrt(
		(a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2,
	);
};
const approximateColor = (color: Color, palette: Palette) => {
	const findIndex = (arg: Color, list: Palette, min: Color): Color => {
		if (list.length === 2) {
			if (colorDistance(arg, min) <= colorDistance(arg, list[1])) {
				return min;
			}
			return list[1];
		}
		const tl = list.slice(1);
		if (colorDistance(arg, min) <= colorDistance(arg, list[1])) {
			return findIndex(arg, tl, min);
		}
		return findIndex(arg, tl, list[1]);
	};
	const foundColor = findIndex(color, palette, palette[0]);
	return foundColor;
};

export const errorDiffusionDither = (
	imageData: ImageData,
	palette: Palette,
	step: number,
	width: number,
	height: number,
) => {
	const d = new Uint8ClampedArray(imageData.data);
	const out = new Uint8ClampedArray(imageData.data);
	const ratio = 1 / 16;

	const getPos = (x: number, y: number) => {
		return 4 * x + 4 * y * width;
	};

	let r: number;
	let g: number;
	let b: number;
	let a: number;
	let q: Color;
	let i: number;
	let color: Color;
	let approx: Color;
	let tr: number;
	let tg: number;
	let tb: number;
	let dx: number;
	let dy: number;
	let di: number;

	for (let y = 0; y < height; y += step) {
		for (let x = 0; x < width; x += step) {
			i = 4 * x + 4 * y * width;

			// Define bytes
			r = i;
			g = i + 1;
			b = i + 2;
			a = i + 3;

			color = new Array(d[r], d[g], d[b]) as Color;
			approx = approximateColor(color, palette);

			// @ts-ignore
			q = [];
			q[r] = d[r] - approx[0];
			q[g] = d[g] - approx[1];
			q[b] = d[b] - approx[2];

			// Diffuse the error
			d[getPos(x + step, y)] = d[getPos(x + step, y)] + 7 * ratio * q[r];
			d[getPos(x - step, y + 1)] =
				d[getPos(x - 1, y + step)] + 3 * ratio * q[r];
			d[getPos(x, y + step)] = d[getPos(x, y + step)] + 5 * ratio * q[r];
			d[getPos(x + step, y + step)] =
				d[getPos(x + 1, y + step)] + 1 * ratio * q[r];

			d[getPos(x + step, y) + 1] =
				d[getPos(x + step, y) + 1] + 7 * ratio * q[g];
			d[getPos(x - step, y + step) + 1] =
				d[getPos(x - step, y + step) + 1] + 3 * ratio * q[g];
			d[getPos(x, y + step) + 1] =
				d[getPos(x, y + step) + 1] + 5 * ratio * q[g];
			d[getPos(x + step, y + step) + 1] =
				d[getPos(x + step, y + step) + 1] + 1 * ratio * q[g];

			d[getPos(x + step, y) + 2] =
				d[getPos(x + step, y) + 2] + 7 * ratio * q[b];
			d[getPos(x - step, y + step) + 2] =
				d[getPos(x - step, y + step) + 2] + 3 * ratio * q[b];
			d[getPos(x, y + step) + 2] =
				d[getPos(x, y + step) + 2] + 5 * ratio * q[b];
			d[getPos(x + step, y + step) + 2] =
				d[getPos(x + step, y + step) + 2] + 1 * ratio * q[b];

			// Color
			tr = approx[0];
			tg = approx[1];
			tb = approx[2];

			// Draw a block
			for (dx = 0; dx < step; dx++) {
				for (dy = 0; dy < step; dy++) {
					di = i + 4 * dx + 4 * width * dy;

					// Draw pixel
					out[di] = tr;
					out[di + 1] = tg;
					out[di + 2] = tb;
				}
			}
		}
	}
	return out;
};
function getErr(_r: number, _g: number, _b: number, stdCol: Color) {
	const r = _r - stdCol[0];
	const g = _g - stdCol[1];
	const b = _b - stdCol[2];
	return r * r + g * g + b * b;
}

function getNear(palette: Palette, r: number, g: number, b: number) {
	let ind = 0;
	let err = getErr(r, g, b, palette[0]);
	for (let i = 1; i < palette.length; i++) {
		const cur = getErr(r, g, b, palette[i]);
		if (cur < err) {
			err = cur;
			ind = i;
		}
	}
	return ind;
}
function setVal(
	data: Uint8ClampedArray,
	palette: Palette,
	i: number,
	c: number,
) {
	data[i] = palette[c][0];
	data[i + 1] = palette[c][1];
	data[i + 2] = palette[c][2];
	data[i + 3] = 255;
}
function addVal(c: Color, r: number, g: number, b: number, k: number) {
	return [c[0] + (r * k) / 32, c[1] + (g * k) / 32, c[2] + (b * k) / 32];
}
const dither = (
	imageData: ImageData,
	palette: Palette,
	width: number,
	height: number,
) => {
	const d = new Uint8ClampedArray(imageData.data);
	const out = new Uint8ClampedArray(imageData.data);
	let aInd = 0;
	let bInd = 1;
	let index = 0;
	const errArr = new Array(2);
	errArr[0] = new Array(width);
	errArr[1] = new Array(height);
	for (let i = 0; i < width; i++) errArr[bInd][i] = [0, 0, 0];
	for (let j = 0; j < height; j++) {
		const y = j;
		bInd = aInd;
		aInd = (aInd + 1) & 1;
		for (let i = 0; i < width; i++) errArr[bInd][i] = [0, 0, 0];
		for (let i = 0; i < width; i++) {
			const x = i;
			if (x < 0 || x >= width) {
				setVal(out, palette, index, (i + j) % 2 === 0 ? 1 : 0);
				index += 4;
				continue;
			}
			const pos = (y * width + x) * 4;
			const old = errArr[aInd][i];
			let r = d[pos] + old[0];
			let g = d[pos + 1] + old[1];
			let b = d[pos + 2] + old[2];
			const colVal = palette[getNear(palette, r, g, b)];
			out[index++] = colVal[0];
			out[index++] = colVal[1];
			out[index++] = colVal[2];
			out[index++] = 255;
			r = r - colVal[0];
			g = g - colVal[1];
			b = b - colVal[2];
			if (i === 0) {
				errArr[bInd][i] = addVal(errArr[bInd][i], r, g, b, 7.0);
				errArr[bInd][i + 1] = addVal(errArr[bInd][i + 1], r, g, b, 2.0);
				errArr[aInd][i + 1] = addVal(errArr[aInd][i + 1], r, g, b, 7.0);
			} else if (i === width - 1) {
				errArr[bInd][i - 1] = addVal(errArr[bInd][i - 1], r, g, b, 7.0);
				errArr[bInd][i] = addVal(errArr[bInd][i], r, g, b, 9.0);
			} else {
				errArr[bInd][i - 1] = addVal(errArr[bInd][i - 1], r, g, b, 3.0);
				errArr[bInd][i] = addVal(errArr[bInd][i], r, g, b, 5.0);
				errArr[bInd][i + 1] = addVal(errArr[bInd][i + 1], r, g, b, 1.0);
				errArr[aInd][i + 1] = addVal(errArr[aInd][i + 1], r, g, b, 7.0);
			}
		}
	}
	return out;
};

export const processImage = (
	sourceCanvas: HTMLCanvasElement,
	transitCanvas: HTMLCanvasElement,
	device: Device,
) => {
	const { palette } = device;

	const sourceWidth = sourceCanvas.width;
	const sourceHeight = sourceCanvas.height;
	if (sourceWidth === 0 || sourceHeight === 0) return;

	const sourceCtx = sourceCanvas.getContext("2d");
	const transitCtx = transitCanvas.getContext("2d");

	const sourceImageData = sourceCtx!.getImageData(
		0,
		0,
		sourceWidth,
		sourceHeight,
	);
	const data = dither(sourceImageData, palette, sourceWidth, sourceHeight);
	// const data = errorDiffusionDither(
	// 	sourceImageData,
	// 	palette,
	// 	1,
	// 	sourceWidth,
	// 	sourceHeight,
	// );
	const transitImageData = new ImageData(data, sourceWidth, sourceHeight);
	transitCtx?.putImageData(transitImageData, 0, 0);
};
