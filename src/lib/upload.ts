function getVal(imageData: ImageData, i: number) {
	if (imageData.data[i] === 0x00 && imageData.data[i + 1] === 0x00) return 0;
	if (imageData.data[i] === 0xff && imageData.data[i + 1] === 0xff) return 1;
	if (imageData.data[i] === 0x7f && imageData.data[i + 1] === 0x7f) return 2;
	return 3;
}
function getVal_7color(imageData: ImageData, i: number) {
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
}
function byteToStr(v: number) {
	return String.fromCharCode((v & 0xf) + 97, ((v >> 4) & 0xf) + 97);
}
function wordToStr(v: number) {
	return byteToStr(v & 0xff) + byteToStr((v >> 8) & 0xff);
}

const getPos = (x: number, y: number, width: number) => {
	return y * width + x;
};

export function uploadImage(
	canvas: HTMLCanvasElement,
	deviceId: number,
	deviceIP: string,
	direction = 0,
) {
	let pxInd = 0;
	let stInd = 0;
	const rqPrf = `http://${deviceIP}/`;
	let xhReq: XMLHttpRequest;
	let rqMsg = "";
	function u_send(cmd: string, next: boolean) {
		xhReq.open("POST", rqPrf + cmd, true);
		xhReq.send("");
		if (next) stInd++;
		return 0;
	}
	function u_next() {
		pxInd = 0;
		u_send("NEXT_", true);
	}
	function u_done() {
		// setInn("logTag", "Complete!");
		return u_send("SHOW_", true);
	}
	function u_show(a: number[], k1: number, k2: number) {
		let x = (k1 + (k2 * pxInd) / a.length).toString();
		if (x.length > 5) {
			x = x.substring(0, 5);
		}
		// setInn("logTag", "Progress: " + x + "%");
		return u_send(`${rqMsg}${wordToStr(rqMsg.length)}LOAD_`, pxInd >= a.length);
	}
	function u_data(a: number[], c: number, k1: number, k2: number) {
		rqMsg = "";
		if (c === -1) {
			while (pxInd < a.length && rqMsg.length < 2000) {
				let v = 0;
				for (let i = 0; i < 16; i += 2)
					if (pxInd < a.length) {
						v |= a[pxInd++] << i;
					}
				rqMsg += wordToStr(v);
			}
		} else if (c === -2) {
			while (pxInd < a.length && rqMsg.length < 2000) {
				let v = 0;
				for (let i = 0; i < 16; i += 4)
					if (pxInd < a.length) {
						v |= a[pxInd++] << i;
					}
				rqMsg += wordToStr(v);
			}
		} else {
			while (pxInd < a.length && rqMsg.length < 2000) {
				let v = 0;
				for (let i = 0; i < 8; i++)
					if (pxInd < a.length && a[pxInd++] !== c) v |= 128 >> i;
				rqMsg += byteToStr(v);
			}
		}
		return u_show(a, k1, k2);
	}
	function u_line(a: number[], c: number, k1: number, k2: number) {
		let x: number;
		rqMsg = "";
		while (rqMsg.length < 2000) {
			x = 0;
			while (x < 122) {
				let v = 0;
				for (let i = 0; i < 8 && x < 122; i++, x++)
					if (Number(a[pxInd++]) !== c) v |= 128 >> i;
				rqMsg += byteToStr(v);
			}
		}
		return u_show(a, k1, k2);
	}
	const width = canvas.width;
	const height = canvas.height;
	const imageData = canvas.getContext("2d")!.getImageData(0, 0, width, height);
	const a: number[] = new Array(width * height).fill(0);
	let i = 0;
	switch (direction) {
		case 90:
			for (let x = width - 1; x >= 0; x--) {
				for (let y = 0; y < height; y++, i++) {
					if (deviceId === 25 || deviceId === 37) {
						a[i] = getVal_7color(imageData, getPos(x, y, width) << 2);
					} else {
						a[i] = getVal(imageData, getPos(x, y, width) << 2);
					}
				}
			}
			break;
		case 180:
			for (let y = height - 1; y >= 0; y--) {
				for (let x = width - 1; x >= 0; x--, i++) {
					if (deviceId === 25 || deviceId === 37) {
						a[i] = getVal_7color(imageData, getPos(x, y, width) << 2);
					} else {
						a[i] = getVal(imageData, getPos(x, y, width) << 2);
					}
				}
			}
			break;
		case 270:
			for (let x = 0; x < width; x++) {
				for (let y = height - 1; y >= 0; y--, i++) {
					if (deviceId === 25 || deviceId === 37) {
						a[i] = getVal_7color(imageData, getPos(x, y, width) << 2);
					} else {
						a[i] = getVal(imageData, getPos(x, y, width) << 2);
					}
				}
			}
			break;
		default:
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++, i++) {
					if (deviceId === 25 || deviceId === 37) {
						a[i] = getVal_7color(imageData, i << 2);
					} else {
						a[i] = getVal(imageData, i << 2);
					}
				}
			}
			break;
	}
	xhReq = new XMLHttpRequest();
	if (deviceId === 3 || deviceId === 39 || deviceId === 43) {
		xhReq.onload = xhReq.onerror = () => {
			if (stInd === 0) return u_line(a, 0, 0, 100);
			if (stInd === 1) return u_done();
		};
		if (deviceId > 25) {
			return u_send(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`, false);
		}
		return u_send(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
	}
	if (deviceId === 40) {
		xhReq.onload = xhReq.onerror = () => {
			if (stInd === 0) return u_line(a, 0, 0, 50);
			if (stInd === 1) return u_next();
			if (stInd === 2) return u_line(a, 3, 50, 50);
			if (stInd === 3) return u_done();
		};
		if (deviceId > 25) {
			return u_send(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`, false);
		}
		return u_send(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
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
			if (stInd === 0) return u_data(a, 0, 0, 100);
			if (stInd === 1) return u_done();
		};
		if (deviceId > 25) {
			return u_send(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`, false);
		}
		return u_send(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
	}
	if (deviceId > 15 && deviceId < 22) {
		xhReq.onload = xhReq.onerror = () => {
			if (stInd === 0) return u_data(a, -1, 0, 100);
			if (stInd === 1) return u_done();
		};
		return u_send(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
	}
	if (deviceId === 25 || deviceId === 37) {
		xhReq.onload = xhReq.onerror = () => {
			if (stInd === 0) return u_data(a, -2, 0, 100);
			if (stInd === 1) return u_done();
		};
		if (deviceId > 25) {
			return u_send(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`, false);
		}
		return u_send(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
	}
	xhReq.onload = xhReq.onerror = () => {
		console.log("*************");
		console.log(stInd);
		console.log("*************");
		if (stInd === 0 && deviceId === 23) return u_data(a, 0, 0, 100);
		if (stInd === 0)
			return u_data(a, deviceId === 1 || deviceId === 12 ? -1 : 0, 0, 50);
		if (stInd === 1) return u_next();
		if (stInd === 2) return u_data(a, 3, 50, 50);
		if (stInd === 3) return u_done();
	};
	if (deviceId > 25) {
		return u_send(`EPD${String.fromCharCode(deviceId + -26 + 65)}_`, false);
	}
	return u_send(`EPD${String.fromCharCode(deviceId + 97)}_`, false);
}
