import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";

type Props = {
	onFileChange: (file: File) => void;
};

export const UploadFile = ({ onFileChange }: Props) => {
	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				const image = acceptedFiles[0];
				onFileChange(image);
			}
		},
		[onFileChange],
	);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });
	const { style, ...inputProps } = getInputProps();
	return (
		<Card>
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
				</div>
				<div className="space-y-2 text-sm">
					<Label className="text-sm font-medium" htmlFor="file">
						File
					</Label>
					<Input
						accept="image/*"
						id="file"
						placeholder="File"
						type="file"
						className="leading-7"
						{...inputProps}
					/>
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
