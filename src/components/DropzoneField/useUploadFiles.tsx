import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { UploadedFile } from ".";
import { storage } from "../../firebase/client";

interface Props {
  acceptedFiles: File[];
  identifier: string;
  isMultiple: boolean;
  savedFiles: UploadedFile[];
  setSavedFiles: (files: UploadedFile[]) => void;
  onUpload?: (files: UploadedFile[]) => Promise<void>;
}

const useUploadFiles = ({
  acceptedFiles,
  identifier,
  isMultiple,
  savedFiles,
  setSavedFiles,
  onUpload,
}: Props) => {
  const [uploadError, setUploadError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadIsLoading, setUploadIsLoading] = useState(false);

  useEffect(() => {
    const handleStorageUpload = async () => {
      // upload the file to storage
      const uploadedFiles: UploadedFile[] = [];
      console.log("length", acceptedFiles.length);
      for (let index = 0; index < acceptedFiles.length; index++) {
        const file = acceptedFiles[index];

        const filePath = `files/${file.name}`;
        const fileRef = ref(storage, filePath); // name = xxx.jpg (already has extension if the upload file has, I think)

        console.log("file path", filePath);
        if (index === 0) {
          setUploadIsLoading(true);
          setUploadError("");
        }

        try {
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);

          const newFile: UploadedFile = {
            url,
            name: file.name,
          };

          const newFiles = [...uploadedFiles, newFile];

          uploadedFiles.push(newFile);
          setUploadedFiles(newFiles);
        } catch (error) {
          console.log("error", error);
          setUploadError(`There was an error with your ${file.name} upload`);
        }

        console.log("savedFiles", savedFiles);
        // can only upload one file
        if (savedFiles.length > 1 && !isMultiple) {
          setUploadError(
            "Only 1 image can be uploaded. If you wish to change the image, please delete the current one first."
          );
          setUploadIsLoading(false);
          return;
        }
        // store and run final actions on uploaded files
        if (index === acceptedFiles.length - 1) {
          if (onUpload) await onUpload(uploadedFiles);
          setSavedFiles([...savedFiles, ...uploadedFiles]);
          setUploadIsLoading(false);
        }
      }
    };

    handleStorageUpload();
  }, [acceptedFiles]);

  // remove files
  const onRemoval = useCallback(
    (fileUrl: string) => {
      setSavedFiles(savedFiles.filter((file) => file.url !== fileUrl));
    },
    [savedFiles]
  );

  return {
    onRemoval,
    uploadedFiles,
    uploadError,
    uploadIsLoading,
  };
};

export default useUploadFiles;
