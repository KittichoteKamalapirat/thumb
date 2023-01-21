import { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";
import { ICON_SIZE } from "../../constants";
import { grey0, primaryColor } from "../../theme";
import Button, { ButtonTypes } from "../Buttons/Button";
import IconButton from "../Buttons/IconButton";
import FormFieldLabel from "../forms/FormFieldLabel";
import FormHelperText from "../forms/FormHelperText";

import useUploadFiles from "./useUploadFiles";

const baseStyle = {
  // padding: "20px",
  // borderWidth: "0.5px",
  // borderRadius: 5,
  // borderColor: "#677BF7",
  // borderStyle: "dashed",
  // borderOpacity: 0.7,
  // backgroundColor: "#677BF7",
  // outline: "none",
  // transition: "border .24s ease-in-out",
  // cursor: "pointer",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const rejectStyle = {
  borderColor: "#ef4444",
};

export interface UploadedFile {
  name: string;
  url: string;
  uploadedAt?: Date;
}

interface Props {
  label: string;
  ariaLabel: string;
  labelfontColor?: string;
  labelClass: string;
  helperText: string;
  displayOptionalLabel: boolean;
  isError: boolean;
  acceptedFileTypes: string | string[];
  maxFiles: number;
  maxSize: number;
  customerId: string;
  fileUploads: UploadedFile[];
  setFileUploads: (files: UploadedFile[]) => void;
  inputClass?: string;
  showConfirmationOnDelete: boolean;
  isDroppable?: boolean;
}

const DropzoneField = ({
  label,
  ariaLabel,
  labelfontColor,
  labelClass,
  helperText,
  isError,
  displayOptionalLabel,
  acceptedFileTypes,
  maxFiles,
  maxSize,
  customerId,
  fileUploads,
  inputClass,
  setFileUploads,
  showConfirmationOnDelete,
  isDroppable = true,
}: Props) => {
  const isMultiple = maxFiles !== 1;
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: acceptedFileTypes as any, // TODO
    maxFiles: maxFiles,
    multiple: isMultiple,
    maxSize: maxSize,
  });

  console.log("fileRejections", fileRejections);

  const { uploadedFiles, onRemoval, uploadError, uploadIsLoading } =
    useUploadFiles({
      acceptedFiles,
      isMultiple,
      identifier: customerId,
      savedFiles: fileUploads,
      setSavedFiles: setFileUploads,
    });

  // error handling
  const inputError =
    isDragReject || fileRejections.length > 0
      ? "There was an error with your upload"
      : "";

  const style = useMemo(
    () => ({
      ...(isDroppable && baseStyle),
      ...(isFocused ? focusedStyle : {}),
      ...(!!inputError || !!uploadError ? rejectStyle : {}),
    }),
    [isFocused, inputError, uploadError]
  );

  useEffect(() => {
    console.log("url in component", uploadedFiles);
  }, [uploadedFiles, uploadIsLoading]);

  return (
    <div>
      {label ? (
        <FormFieldLabel
          label={label}
          fontColor={labelfontColor}
          displayOptionalLabel={displayOptionalLabel}
          extraClass={labelClass}
        />
      ) : null}
      <div>
        <div
          id="input"
          {...getRootProps({
            style: fileUploads.length === 0 ? style : {},
            "aria-label": `${label || ariaLabel}-div`,
            className: inputClass,
          })}
        >
          <input
            {...getInputProps({
              "aria-label": `${label || ariaLabel}-label`,
            })}
          />
          {fileUploads.length ? (
            <div className="relative">
              {/* images uploaded */}
              <img src={fileUploads[0].url} className="w-full rounded-xl" />
              <IconButton
                icon={<HiOutlineTrash size={ICON_SIZE + 10} color={grey0} />}
                onClick={() =>
                  showConfirmationOnDelete
                    ? console.log(
                        "alertModal.requireConfirmationModal(handleRemoval(file.key))"
                      )
                    : onRemoval(fileUploads[0].url)
                }
                label={`${fileUploads[0].name}-remove`}
                className="z-10 absolute -top-5 -right-5 p-2 rounded-full bg-red-500 hover:bg-red-400 hover:cursor-pointer"
              />
            </div>
          ) : (
            <div>
              {/* no image and uploading */}
              {uploadIsLoading ? (
                <p className="mt-2.5 font-nunito font-thin text-11px text-grey-420 text-center">
                  Uploading...
                </p>
              ) : (
                <div className="flex flex-col items-center ">
                  {/* no image and not uploading */}
                  <p className="text-primary">Drop a thumbnail to test here</p>
                  <AiOutlineCloudUpload
                    size={ICON_SIZE + 50}
                    color={primaryColor}
                  />
                  <Button label="Browse" type={ButtonTypes.OUTLINED} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FormHelperText
        isError={isError || !!inputError || !!uploadError}
        helperText={uploadError || inputError || helperText}
        spacing="mt-2 mb-3"
      />
    </div>
  );
};

DropzoneField.defaultProps = {
  label: "",
  ariaLabel: "",
  labelClass: "mb-2",
  helperText: "",
  displayOptionalLabel: false,
  isError: false,
  acceptedFileTypes: "",
  maxFiles: 0, // 0 means no limit
  maxSize: 10000000, // 10MB
  customerId: "",
};

export default DropzoneField;
