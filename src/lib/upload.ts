import { getPixels } from "./pixel";
import { settingsAtom, store } from "./atom";

const MAX_MSG_LEN = 2000;

function byteToStr(v: number) {
	return String.fromCharCode((v & 0xf) + 97, ((v >> 4) & 0xf) + 97);
}
function wordToStr(v: number) {
	return byteToStr(v & 0xff) + byteToStr((v >> 8) & 0xff);
}

const request = (cmd: string) => {
	const deviceIP = store.get(settingsAtom).deviceIP;
	const baseURL = `http://${deviceIP}/`;
	return fetch(baseURL + cmd, {
		method: "POST",
	});
};

export const uploadImage = async (
	canvas: HTMLCanvasElement,
	callback: (progress: number) => void,
) => {
	const { device, direction } = store.get(settingsAtom);
	const deviceId = Number(device);
	const pixels = getPixels(canvas, deviceId, Number(direction));
	let pixelIndex = 0;

	const sendNext = () => {
		pixelIndex = 0;
		return request("NEXT_");
	};
	const sendShow = () => request("SHOW_");
	const sendLoad = (data: string) =>
		request(`${data}${wordToStr(data.length)}LOAD_`);
	const sendLine = (color: number) => {
		let x: number;
		let msg = "";
		while (msg.length < MAX_MSG_LEN) {
			x = 0;
			while (x < 122) {
				let v = 0;
				for (let i = 0; i < 8 && x < 122; i++, x++)
					if (Number(pixels[pixelIndex++]) !== color) v |= 128 >> i;
				msg += byteToStr(v);
			}
		}
		return sendLoad(msg);
	};
	const sendData = async (color: number) => {
		while (pixelIndex < pixels.length) {
			let msg = "";
			if (color === -1) {
				while (pixelIndex < pixels.length && msg.length < MAX_MSG_LEN) {
					let v = 0;
					for (let i = 0; i < 16; i += 2)
						if (pixelIndex < pixels.length) {
							v |= pixels[pixelIndex++] << i;
						}
					msg += wordToStr(v);
				}
			} else if (color === -2) {
				while (pixelIndex < pixels.length && msg.length < MAX_MSG_LEN) {
					let v = 0;
					for (let i = 0; i < 16; i += 4)
						if (pixelIndex < pixels.length) {
							v |= pixels[pixelIndex++] << i;
						}
					msg += wordToStr(v);
				}
			} else {
				while (pixelIndex < pixels.length && msg.length < MAX_MSG_LEN) {
					let v = 0;
					for (let i = 0; i < 8; i++)
						if (pixelIndex < pixels.length && pixels[pixelIndex++] !== color)
							v |= 128 >> i;
					msg += byteToStr(v);
				}
			}
			await sendLoad(msg);
		}
	};
	if (deviceId > 25) {
		await request(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`);
	} else {
		await request(`EPD${String.fromCharCode(deviceId + 97)}_`);
	}
	if (deviceId === 3 || deviceId === 39 || deviceId === 43) {
		await sendLine(0);
		await sendShow();
	} else if (deviceId === 40) {
		await sendLine(0);
		await sendNext();
		await sendLine(3);
		await sendShow();
	} else if ([0, 3, 6, 7, 9, 12, 16, 19, 22, 26, 27, 28].includes(deviceId)) {
		await sendData(0);
		await sendShow();
	} else if (deviceId > 15 && deviceId < 22) {
		await sendData(-1);
		await sendShow();
	} else if (deviceId === 25 || deviceId === 37) {
		await sendData(-2);
		sendShow();
	} else {
		if (deviceId === 23) {
			await sendData(0);
		} else {
			await sendData(deviceId === 1 || deviceId === 12 ? -1 : 0);
		}
		await sendNext();
		await sendData(3);
		await sendShow();
	}
};
