import { ReactNode, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ReactModal from "react-modal";
import { ICON_SIZE } from "../../constants";
import { AlertType } from "../../redux/types/AlertModalType";
import { green, grey500, grey900, red, yellow } from "../../theme";
import IconButton from "../Buttons/IconButton";
import PageHeading from "../typography/PageHeading";

interface Props {
  contentLabel: string;
  isOpen: boolean;
  onAfterOpen?: () => void;
  onRequestClose: () => void;
  minWidth?: string;
  children: ReactNode;
  heading: string;
  maxWidth?: string;
  modalSpacing?: string;
  zIndex?: number;
  type?: AlertType;
}

const Modal = ({
  maxWidth,
  type = "danger",
  contentLabel,
  isOpen,
  onAfterOpen,
  onRequestClose,
  minWidth,
  children,
  heading,
  modalSpacing = "p-6",
  zIndex,
}: Props) => {
  const [iconColor, setIconColor] = useState(grey900);
  const borderColor = (() => {
    switch (type) {
      case "success":
        return green;
      case "warning":
        return yellow;
      case "danger":
      default:
        return red;
    }
  })();
  const styles = {
    content: {
      minWidth: minWidth || "700px",
      maxWidth: maxWidth || "1200px",
      maxHeight: "700px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      border: `2px solid ${borderColor}`,
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
    },
    overlay: { zIndex: zIndex || 1 },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      ariaHideApp={false}
      style={styles}
    >
      <div className={modalSpacing}>
        <div className="flex justify-between items-start">
          <PageHeading heading={heading} />
          <IconButton
            label="close"
            onClick={onRequestClose}
            icon={
              <IoMdClose
                size={ICON_SIZE + 10}
                color={iconColor}
                onMouseOver={() => setIconColor(grey500)}
                onMouseOut={() => setIconColor(grey900)}
              />
            }
          />
        </div>
        <div> {children}</div>
      </div>
    </ReactModal>
  );
};

export default Modal;
