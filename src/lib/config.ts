export type Color = [number, number, number];
export type Palette = Color[];

export const palettes: Palette[] = [
	// black and white
	[
		[0, 0, 0],
		[255, 255, 255],
	],
	// black, white, red
	[
		[0, 0, 0],
		[255, 255, 255],
		[127, 0, 0],
	],
	// black, white, gray
	[
		[0, 0, 0],
		[255, 255, 255],
		[127, 127, 127],
	],
	// black, white, gray, red
	[
		[0, 0, 0],
		[255, 255, 255],
		[127, 127, 127],
		[127, 0, 0],
	],
	// black and white
	[
		[0, 0, 0],
		[255, 255, 255],
	],
	// black, white, yellow
	[
		[0, 0, 0],
		[255, 255, 255],
		[220, 180, 0],
	],
	// black
	[[0, 0, 0]],
	// black, white, green, blue, red, yellow, orange
	[
		[0, 0, 0],
		[255, 255, 255],
		[0, 255, 0],
		[0, 0, 255],
		[255, 0, 0],
		[255, 255, 0],
		[255, 128, 0],
	],
];

export type Device = {
	name: string;
	id: string;
	width: number;
	height: number;
	palette: Palette;
};
export const devices: Device[] = [
	{ id: "0", name: "1.54", width: 200, height: 200, palette: palettes[0] },
	{ id: "1", name: "1.54b", width: 200, height: 200, palette: palettes[3] },
	{ id: "2", name: "1.54c", width: 152, height: 152, palette: palettes[5] },
	{ id: "3", name: "2.13", width: 122, height: 250, palette: palettes[0] },
	{ id: "4", name: "2.13b", width: 104, height: 212, palette: palettes[1] },
	{ id: "5", name: "2.13c", width: 104, height: 212, palette: palettes[5] },
	{ id: "6", name: "2.13d", width: 104, height: 212, palette: palettes[0] },
	{ id: "7", name: "2.7", width: 176, height: 264, palette: palettes[0] },
	{ id: "8", name: "2.7b", width: 176, height: 264, palette: palettes[1] },
	{ id: "9", name: "2.9", width: 128, height: 296, palette: palettes[0] },
	{ id: "10", name: "2.9b", width: 128, height: 296, palette: palettes[1] },
	{ id: "11", name: "2.9c", width: 128, height: 296, palette: palettes[5] },
	{ id: "12", name: "2.9d", width: 128, height: 296, palette: palettes[0] },
	{ id: "13", name: "4.2", width: 400, height: 300, palette: palettes[0] },
	{ id: "14", name: "4.2b", width: 400, height: 300, palette: palettes[1] },
	{ id: "15", name: "4.2c", width: 400, height: 300, palette: palettes[5] },
	{ id: "16", name: "5.83", width: 600, height: 448, palette: palettes[0] },
	{ id: "17", name: "5.83b", width: 600, height: 448, palette: palettes[1] },
	{ id: "18", name: "5.83c", width: 600, height: 448, palette: palettes[5] },
	{ id: "19", name: "7.5", width: 640, height: 384, palette: palettes[0] },
	{ id: "20", name: "7.5b", width: 640, height: 384, palette: palettes[1] },
	{ id: "21", name: "7.5c", width: 640, height: 384, palette: palettes[5] },
	{ id: "22", name: "7.5 V2", width: 800, height: 480, palette: palettes[0] },
	{ id: "23", name: "7.5b V2", width: 800, height: 480, palette: palettes[1] },
	{ id: "24", name: "7.5b HD", width: 880, height: 528, palette: palettes[1] },
	{ id: "25", name: "5.65f", width: 600, height: 448, palette: palettes[7] },
	{ id: "26", name: "7.5 HD", width: 880, height: 528, palette: palettes[0] },
	{ id: "27", name: "3.7", width: 280, height: 480, palette: palettes[0] },
	{ id: "28", name: "2.66", width: 152, height: 296, palette: palettes[0] },
	{ id: "29", name: "5.83b V2", width: 648, height: 480, palette: palettes[1] },
	{ id: "30", name: "2.9b V3", width: 128, height: 296, palette: palettes[1] },
	{ id: "31", name: "1.54b V2", width: 200, height: 200, palette: palettes[1] },
	{ id: "32", name: "2.13b V3", width: 104, height: 214, palette: palettes[1] },
	{ id: "33", name: "2.9 V2", width: 128, height: 296, palette: palettes[0] },
	{ id: "34", name: "4.2b V2", width: 400, height: 300, palette: palettes[1] },
	{ id: "35", name: "2.66b", width: 152, height: 296, palette: palettes[1] },
	{ id: "36", name: "5.83 V2", width: 648, height: 480, palette: palettes[0] },
	{ id: "37", name: "4.01 f", width: 640, height: 400, palette: palettes[7] },
	{ id: "38", name: "2.7b V2", width: 176, height: 264, palette: palettes[1] },
	{ id: "39", name: "2.13 V3", width: 122, height: 250, palette: palettes[0] },
	{
		id: "40",
		name: "2.13 B V4",
		width: 122,
		height: 250,
		palette: palettes[1],
	},
	{ id: "41", name: "3.52", width: 240, height: 360, palette: palettes[0] },
	{ id: "42", name: "2.7 V2", width: 176, height: 264, palette: palettes[0] },
	{ id: "43", name: "2.13 V4", width: 122, height: 250, palette: palettes[0] },
	{ id: "44", name: "4.2 V2", width: 400, height: 300, palette: palettes[0] },
	{ id: "45", name: "13.3k", width: 960, height: 680, palette: palettes[0] },
	{ id: "46", name: "4.26", width: 800, height: 480, palette: palettes[0] },
	{ id: "47", name: "2.9bV4", width: 128, height: 296, palette: palettes[1] },
	{ id: "48", name: "13.3b", width: 960, height: 680, palette: palettes[1] },
];

export const SETTING_KEY = "setting-key";
