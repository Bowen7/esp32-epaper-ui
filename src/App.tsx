import { useState } from "react";
import clsx from "clsx";
import { ModeToggle } from "@/components/mode-toggle";
import { SettingToggle } from "./components/setting-toggle";
import { UploadFile } from "./components/upload-file";
import { Editor } from "./components/editor";

function App() {
	const [image, setImage] = useState<File | null>(null);
	return (
		<main className="h-screen flex flex-col items-center">
			<header className="h-14 w-full border-b border-border/40 flex items-center px-8 gap-x-4 justify-end">
				<SettingToggle />
				<ModeToggle />
			</header>
			<div
				className={clsx("flex flex-1 gap-y-4 overflow-auto max-w-7xl", {
					"items-center": !image,
					"justify-center": !image,
					"pb-28": !image,
				})}
			>
				{!image && <UploadFile onFileChange={setImage} />}
				{image && <Editor image={image} />}
			</div>
		</main>
	);
}

export default App;
