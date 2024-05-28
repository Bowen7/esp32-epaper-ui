import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Props = {
	onChange: (url: string) => void;
};

export const UploadFile = ({ onChange }: Props) => {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const uploadDisabled = !url || loading;

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				const image = acceptedFiles[0];
				const url = URL.createObjectURL(image);
				onChange(url);
			}
		},
		[onChange],
	);

	const showUploadError = () => {
		toast({
			title: "We can't fetch data from the URL",
			description:
				"Make sure your image URL correctly and has already been set with Access-Control-Allow-Origin: *",
		});
		setLoading(false);
	};

	const onUpload = async () => {
		setLoading(true);
		try {
			const res = await fetch(url);
			const allowOrigin = res.headers.get("Access-Control-Allow-Origin");
			const contentType = res.headers.get("Content-Type");
			if (allowOrigin !== "*" || !contentType?.includes("image")) {
				return showUploadError();
			}
			setLoading(false);
			onChange(url);
		} catch (error) {
			return showUploadError();
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		disabled: loading,
	});
	return (
		<Card className="w-96">
			<CardContent className="p-6 space-y-4">
				<div
					className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center"
					{...getRootProps()}
				>
					<FileIcon className="w-12 h-12" />
					<span className="text-sm font-medium text-gray-500">
						Drag and drop a file or click to browse
					</span>
					<span className="text-xs text-gray-500">image</span>
					<Input
						accept="image/*"
						id="file"
						placeholder="File"
						type="file"
						className="leading-7"
						{...getInputProps()}
					/>
				</div>
				<div className="space-y-2 text-sm">
					<Label className="text-sm font-medium" htmlFor="file">
						Or input an image address
					</Label>
					<Input value={url} onChange={(e) => setUrl(e.target.value)} />
					<div className="text-xs text-gray-500">
						Make sure your image URL has already been set with
						Access-Control-Allow-Origin: *
					</div>
					<div className="text-right !mt-4">
						<Button onClick={onUpload} disabled={uploadDisabled}>
							{loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
							Enter
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>upload file</title>
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		</svg>
	);
}
