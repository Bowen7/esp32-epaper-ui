import { useState } from "react";
import clsx from "clsx";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "./components/ui/toaster";
import { SettingToggle } from "./components/setting-toggle";
import { UploadFile } from "./components/upload-file";
import { Editor } from "./components/editor";

function App() {
	const [url, setUrl] = useState(
		"https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1e7.svg",
	);
	// const [url, setUrl] = useState("");
	return (
		<main className="h-screen flex flex-col items-center">
			<header className="h-14 w-full border-b border-border/40 flex items-center px-8 gap-x-4 justify-end">
				<SettingToggle />
				<ModeToggle />
			</header>
			<div
				className={clsx(
					"flex flex-1 gap-y-4 overflow-auto max-w-screen-xl w-full",
					{
						"items-center": !url,
						"justify-center": !url,
						"pb-28": !url,
					},
				)}
			>
				{!url && <UploadFile onChange={setUrl} />}
				{url && <Editor url={url} onBack={() => setUrl("")} />}
			</div>
			<Toaster />
		</main>
	);
}

export default App;
