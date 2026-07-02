import styles from "@/styles/fileUpload.module.scss";
import { faFile, faFileAudio, faFilePdf, faImage, faTrash, faUpload, faVideo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";

type FileProps = {
	id: string;
	file: File;
	progress: number;
	uploaded: boolean;
};

type FileInputProps = {
	inputRef: React.RefObject<HTMLInputElement | null>;
	disabled: boolean;
	multiple: boolean;
	onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
};

type FileUploadProps = {
	multiple: boolean;
};

type FileListProps = {
	files: FileProps[];
	onRemove: (id: string) => void;
	uploading: boolean;
};

type FileItemProps = {
	file: FileProps;
	onRemove: (id: string) => void;
	uploading: boolean;
};

type ProgressBarProps = {
	progress: number;
};

type ActionButtonsProps = {
	disabled: boolean;
	onUpload: () => void;
	onClear: () => void;
};

function Input({ inputRef, disabled, onFileSelect, multiple }: FileInputProps) {
	return (
		<>
			<input
				type="file"
				ref={inputRef}
				onChange={onFileSelect}
				multiple={multiple}
				className={styles.hidden}
				id={styles.fileUpload}
				disabled={disabled}
			/>
			<label htmlFor={styles.fileUpload}>Select Files</label>
		</>
	);
}

function getFileIcon(mimeType: string) {
	switch (true) {
		case mimeType.startsWith("image/"):
			return faImage;
		case mimeType.startsWith("video/"):
			return faVideo;
		case mimeType.startsWith("audio/"):
			return faFileAudio;
		case mimeType.startsWith("application/pdf/"):
			return faFilePdf;
		default:
			return faFile;
	}
}

function formatFileSize(bytes: number) {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;

	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const formattedBytes = (bytes / Math.pow(k, i)).toFixed(1);
	return `${parseFloat(formattedBytes)} ${sizes[i]}`;
}

function ProgressBar({ progress }: ProgressBarProps) {
	return (
		<div>
			<div style={{ backgroundColor: "pink", width: `${progress}%` }}></div>
		</div>
	);
}

function Item({ file, onRemove, uploading }: FileItemProps) {
	const icon = getFileIcon(file.file.type);
	return (
		<div>
			<FontAwesomeIcon icon={icon} />
			HIII {file.file.name}
			<br />
			{formatFileSize(file.file.size)}
			{!uploading && (
				<button onClick={() => onRemove(file.id)}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			)}
			{file.uploaded ? "Completed" : `${Math.round(file.progress)}%`}
			<ProgressBar progress={file.progress} />
		</div>
	);
}

function FileList({ files, onRemove, uploading }: FileListProps) {
	if (files?.length === 0) return null;

	return (
		<div>
			<div>
				Files
				{files.map((file) => (
					<Item
						key={file.id}
						file={file}
						onRemove={onRemove}
						uploading={uploading}
					/>
				))}
			</div>
		</div>
	);
}

function ActionButtons({ disabled, onUpload, onClear }: ActionButtonsProps) {
	return (
		<>
			<button
				onClick={onUpload}
				disabled={disabled}>
				<FontAwesomeIcon icon={faUpload} />
				Upload
			</button>
			<button
				onClick={onClear}
				disabled={disabled}>
				<FontAwesomeIcon icon={faXmark} />
				Remove All
			</button>
		</>
	);
}

function FileUpload({ multiple = false }: FileUploadProps) {
	const [files, setFiles] = useState<FileProps[]>([]);
	const [uploading, setUploading] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) {
			return;
		}
		console.log("Selected files:", e.target.files.length);
		const selectedFiles = Array.from(e.target.files).map((file) => ({
			// id: `${file.name}-${file.size}-${file.lastModified}`,
			id: `${file.name}`,
			file,
			progress: 0,
			uploaded: false,
		}));

		setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const removeFile = (id: string) => {
		setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
	};

	const handleClear = () => {
		setFiles([]);
	};

	const handleUpload = () => {
		if (files.length === 0 || uploading) return;
		setUploading(true);

		const uploadPromises = files.map(async (file) => {
			const formData = new FormData();
			formData.append("file", file.file);

			try {
				await fetch(`'`, formData);
			} catch (error) {
				console.error(error);
			}
		});
	};

	return (
		<div>
			File Upload
			<ActionButtons
				disabled={files.length === 0 || uploading}
				onClear={handleClear}
				onUpload={handleUpload}
			/>
			<Input
				inputRef={inputRef}
				disabled={uploading}
				multiple={multiple}
				onFileSelect={handleFileSelect}
			/>
			<FileList
				files={files}
				onRemove={removeFile}
				uploading={uploading}
			/>
		</div>
	);
}
export default FileUpload;
