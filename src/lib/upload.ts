import { getPixels } from "./pixel";
function byteToStr(v: number) {
	return String.fromCharCode((v & 0xf) + 97, ((v >> 4) & 0xf) + 97);
}
function wordToStr(v: number) {
	return byteToStr(v & 0xff) + byteToStr((v >> 8) & 0xff);
}

// const request = (cmd: string) => {};

export async function uploadImage(
	canvas: HTMLCanvasElement,
	deviceId: number,
	deviceIP: string,
	direction = 0,
) {
	return new Promise((resolve, reject) => {
		let pixelIndex = 0;
		let requestCount = 0;
		const rqPrf = `http://${deviceIP}/`;
		let xhReq: XMLHttpRequest;
		let rqMsg = "";
		function request(cmd: string, next: boolean) {
			xhReq.open("POST", rqPrf + cmd, true);
			xhReq.send("");
			if (next) requestCount++;
			return 0;
		}
		function sendNext() {
			pixelIndex = 0;
			request("NEXT_", true);
		}
		async function sendShow() {
			await request("SHOW_", true);
			resolve(void 0);
		}
		function sendLoad(pixels: number[]) {
			return request(
				`${rqMsg}${wordToStr(rqMsg.length)}LOAD_`,
				pixelIndex >= pixels.length,
			);
		}
		function u_data(pixels: number[], c: number) {
			rqMsg = "";
			if (c === -1) {
				while (pixelIndex < pixels.length && rqMsg.length < 2000) {
					let v = 0;
					for (let i = 0; i < 16; i += 2)
						if (pixelIndex < pixels.length) {
							v |= pixels[pixelIndex++] << i;
						}
					rqMsg += wordToStr(v);
				}
			} else if (c === -2) {
				while (pixelIndex < pixels.length && rqMsg.length < 2000) {
					let v = 0;
					for (let i = 0; i < 16; i += 4)
						if (pixelIndex < pixels.length) {
							v |= pixels[pixelIndex++] << i;
						}
					rqMsg += wordToStr(v);
				}
			} else {
				while (pixelIndex < pixels.length && rqMsg.length < 2000) {
					let v = 0;
					for (let i = 0; i < 8; i++)
						if (pixelIndex < pixels.length && pixels[pixelIndex++] !== c)
							v |= 128 >> i;
					rqMsg += byteToStr(v);
				}
			}
			return sendLoad(pixels);
		}
		function u_line(pixels: number[], c: number) {
			let x: number;
			rqMsg = "";
			while (rqMsg.length < 2000) {
				x = 0;
				while (x < 122) {
					let v = 0;
					for (let i = 0; i < 8 && x < 122; i++, x++)
						if (Number(pixels[pixelIndex++]) !== c) v |= 128 >> i;
					rqMsg += byteToStr(v);
				}
			}
			return sendLoad(pixels);
		}

		const pixels = getPixels(canvas, deviceId, direction);

		xhReq = new XMLHttpRequest();
		if (deviceId === 3 || deviceId === 39 || deviceId === 43) {
			xhReq.onload = xhReq.onerror = () => {
				if (requestCount === 0) return u_line(pixels, 0);
				if (requestCount === 1) return sendShow();
			};
			if (deviceId > 25) {
				return request(
					`EPD${String.fromCharCode(deviceId + -26 + 65)}_`,
					false,
				);
			}
			return request(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
		}
		if (deviceId === 40) {
			xhReq.onload = xhReq.onerror = () => {
				if (requestCount === 0) return u_line(pixels, 0);
				if (requestCount === 1) return sendNext();
				if (requestCount === 2) return u_line(pixels, 3);
				if (requestCount === 3) return sendShow();
			};
			if (deviceId > 25) {
				return request(
					`EPD${String.fromCharCode(deviceId + -26 + 65)}_`,
					false,
				);
			}
			return request(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
		}
		if (
			deviceId === 0 ||
			deviceId === 3 ||
			deviceId === 6 ||
			deviceId === 7 ||
			deviceId === 9 ||
			deviceId === 12 ||
			deviceId === 16 ||
			deviceId === 19 ||
			deviceId === 22 ||
			deviceId === 26 ||
			deviceId === 27 ||
			deviceId === 28
		) {
			xhReq.onload = xhReq.onerror = () => {
				if (requestCount === 0) return u_data(pixels, 0);
				if (requestCount === 1) return sendShow();
			};
			if (deviceId > 25) {
				return request(
					`EPD${String.fromCharCode(deviceId + -26 + 65)}_`,
					false,
				);
			}
			return request(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
		}
		if (deviceId > 15 && deviceId < 22) {
			xhReq.onload = xhReq.onerror = () => {
				if (requestCount === 0) return u_data(pixels, -1);
				if (requestCount === 1) return sendShow();
			};
			return request(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
		}
		if (deviceId === 25 || deviceId === 37) {
			xhReq.onload = xhReq.onerror = () => {
				if (requestCount === 0) return u_data(pixels, -2);
				if (requestCount === 1) return sendShow();
			};
			if (deviceId > 25) {
				return request(
					`EPD${String.fromCharCode(deviceId + -26 + 65)}_`,
					false,
				);
			}
			return request(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
		}
		xhReq.onload = xhReq.onerror = () => {
			if (requestCount === 0 && deviceId === 23) return u_data(pixels, 0);
			if (requestCount === 0)
				return u_data(pixels, deviceId === 1 || deviceId === 12 ? -1 : 0);
			if (requestCount === 1) return sendNext();
			if (requestCount === 2) return u_data(pixels, 3);
			if (requestCount === 3) return sendShow();
		};
		if (deviceId > 25) {
			return request(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`, false);
		}
		return request(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
	});
}
