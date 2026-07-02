import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

interface UploadedFile {
	file: File;
	preview: string;
	status: "pending" | "uploading" | "done" | "error";
	progress: number;
}

function FIleDropzone({ onUpload }: { onUpload: (urls: string[]) => void }) {
	const [files, setFiles] = useState<UploadedFile[]>([]);

	const uploadFiles = async (filesToUpload: UploadedFile[]) => {
		for (const fileData of filesToUpload) {
			setFiles((prev) => prev.map((f) => (f.file === fileData.file ? { ...f, status: "uploading" } : f)));

			// Get presigned URL from your API
			const { url, key } = await getPresignedUrl(fileData.file.name, fileData.file.type);

			// Upload directly to S3
			const xhr = new XMLHttpRequest();
			xhr.upload.onprogress = (e) => {
				const progress = Math.round((e.loaded / e.total) * 100);
				setFiles((prev) => prev.map((f) => (f.file === fileData.file ? { ...f, progress } : f)));
			};

			await new Promise<void>((resolve, reject) => {
				xhr.onload = () => {
					setFiles((prev) => prev.map((f) => (f.file === fileData.file ? { ...f, status: "done", progress: 100 } : f)));
					resolve();
				};
				xhr.onerror = reject;
				xhr.open("PUT", url);
				xhr.setRequestHeader("Content-Type", fileData.file.type);
				xhr.send(fileData.file);
			});
		}
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const newFiles = acceptedFiles.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
			status: "pending" as const,
			progress: 0,
		}));
		setFiles((prev) => [...prev, ...newFiles]);
		uploadFiles(newFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
		onDrop,
		accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
		maxSize: 10 * 1024 * 1024, // 10MB
		maxFiles: 5,
		onDropRejected: (rejections) => {
			rejections.forEach(({ file, errors }) => {
				console.error(`${file.name}: ${errors.map((e) => e.message).join(", ")}`);
			});
		},
	});

	return (
		<div>
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : isDragReject ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}>
				<input {...getInputProps()} />
				{isDragActive ? <p>Drop files here...</p> : <p>Drag & drop images here, or click to select (max 5 files, 10MB each)</p>}
			</div>

			{files.length > 0 && (
				<div className="mt-4 grid grid-cols-3 gap-4">
					{files.map((fileData, i) => (
						<div
							key={i}
							className="relative">
							<img
								src={fileData.preview}
								className="w-full h-32 object-cover rounded"
							/>
							{fileData.status === "uploading" && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
									<span className="text-white text-sm">{fileData.progress}%</span>
								</div>
							)}
							{fileData.status === "done" && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">✓</div>}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
