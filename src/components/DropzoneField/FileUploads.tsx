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
    <div className="grid grid-cols-12 gap-4 flex-wrap">
      {files.map((file) => (
        <div
          key={file.name}
          className="col-span-6 xl:col-span-4 flex flex-col items-center gap-2 mt-2"
        >
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            <img src={file.url} alt="Salon" className="w-full " />
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
    </div>
  );
};

FileUploads.defaultProps = {
  isMultiple: false,
};

export default FileUploads;
