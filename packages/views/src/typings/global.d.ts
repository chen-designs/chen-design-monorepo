interface Window {
	showOpenFilePicker: (option: any) => Promise<FileSystemFileHandle[]>
	showDirectoryPicker: (option: any) => Promise<FileSystemDirectoryHandle>
	showSaveFilePicker: (option: any) => Promise<FileSystemFileHandle>
}
