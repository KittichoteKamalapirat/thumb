import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { ICON_SIZE } from "../../constants";
import { primaryColor } from "../../theme";
import ContainerActionColumn from "./containerActionColumn";

export const containerColumns = () => {
  return [
    {
      Header: "Container",
      accessor: "col",
      Cell: ({ value: col }: { value: string }) => (
        <div>{col.toUpperCase()}</div>
      ),
    },
    {
      Header: "Temperature",
      accessor: "currTemp",
    },
    {
      Header: "Humidity",
      accessor: "currHum",
    },
    {
      Header: <div>
        <div id="connection-header" className="flex gap-1 items-center hover:cursor-pointer">
          <p>Connection</p>
          <IoMdInformationCircleOutline
            size={ICON_SIZE + 2}
            color={primaryColor}
          />

        </div>
        <Tooltip anchorId="connection-header">
          <div>
            A status indicating whether a container is plugged.
          </div>
        </Tooltip>
      </div>,
      accessor: "isConnected",
      Cell: ({ value: isConnected }: { value: boolean }) => (
        <div>
          {isConnected ? (
            <span className="text-grey-900 font-bold animate-pulse-2 ">
              Connected
            </span>
          ) : (
            <span className="text-grey-500">Disconnected</span>
          )}
        </div>
      ),
    },
    {
      Header: <div>
        <div id="responding-header" className="flex gap-1 items-center hover:cursor-pointer">
          <p>Active</p>
          <IoMdInformationCircleOutline
            size={ICON_SIZE + 2}
            color={primaryColor}
          />

        </div>
        <Tooltip anchorId="responding-header">
          <div>
            A status indicating whether a container is responding.
          </div>
        </Tooltip>
      </div>,
      accessor: "isResponding",
      Cell: ({ value: isConnected }: { value: boolean }) => (
        <div>
          {isConnected ? (
            <span className="text-green-500 font-bold animate-pulse-2">
              Online
            </span>
          ) : (
            <span className="text-grey-500">Offline</span>
          )}
        </div>
      ),
    },

    {
      Header: "Action",
      Cell: ({ row }: { row: any }) => <ContainerActionColumn row={row} />,
    },
  ];
};
