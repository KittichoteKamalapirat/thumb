import { UploadedFile } from ".";
import IconButton from "../Buttons/IconButton";

import { HiOutlineExternalLink, HiOutlineTrash } from "react-icons/hi";

interface Props {
  files: UploadedFile[];
  isMultiple: boolean;
  showConfirmationOnDelete: boolean;
  onRemoval: (fileKey: string) => void;
}

const FileUploads = ({
  files,
  isMultiple,
  showConfirmationOnDelete,
  onRemoval,
}: Props) => {
  return (
    <>
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center gap-2 w-1/2 max-w-2xl-center mt-2.5"
        >
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            <img src={file.url} alt="Salon" width={60} height={60} />
          </a>

          <div className="flex flex-nowrap">
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <HiOutlineExternalLink />
            </a>

            <IconButton
              icon={<HiOutlineTrash />}
              onClick={() =>
                showConfirmationOnDelete
                  ? console.log(
                      "alertModal.requireConfirmationModal(handleRemoval(file.key))"
                    )
                  : onRemoval(file.url)
              }
              label={`${file.name}-remove`}
              className="ml-3 opacity-80"
            />
          </div>
        </div>
      ))}
    </>
  );
};

FileUploads.defaultProps = {
  isMultiple: false,
};

export default FileUploads;
