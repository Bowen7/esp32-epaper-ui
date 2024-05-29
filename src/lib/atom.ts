import { createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const store = createStore();

export const SETTING_KEY = "setting-key";
export const IMAGE_OPTIONS_KEY = "image-options-key";

export type Setting = {
	device: string;
	deviceIP: string;
	direction: string;
};

export type ImageOptions = {
	size: "original" | "contain" | "cover";
	verticalAlign: "top" | "center" | "bottom";
	horizontalAlign: "left" | "center" | "right";
};

export const settingsAtom = atomWithStorage<Setting>(SETTING_KEY, {
	device: "0",
	deviceIP: "",
	direction: "0",
});

export const imageOptionsAtom = atomWithStorage<ImageOptions>(
	IMAGE_OPTIONS_KEY,
	{
		size: "original",
		verticalAlign: "top",
		horizontalAlign: "left",
	},
);
