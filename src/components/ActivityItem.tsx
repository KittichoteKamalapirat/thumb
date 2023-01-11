import dayjs from "dayjs";
import { Action } from "../generated/graphql";
import {
  ACTION_TYPE_OBJ,
  ACTION_TYPE_VALUES,
} from "../utils/actionTypeToLabel";
import HDivider from "./layouts/HDivider";
import SmallHeading from "./typography/SmallHeading";

interface Props {
  action: Partial<Action>;
}

const ActivityItem = ({ action }: Props) => {
  const { officer, passed, createdAt } = action;

  return (
    <div>
      <SmallHeading
        heading={ACTION_TYPE_OBJ[action.type as ACTION_TYPE_VALUES]}
        extraClass="text-grey-500"
      />
      <div className="flex gap-10 mt-2">
        <div id="left" className="font-bold">
          <div>Officer Number</div>
          <div>Timestamp</div>
          <div>Status</div>
        </div>

        <div id="right">
          <div>{officer?.officerNum}</div>
          <div>
            <span>{dayjs(createdAt).format("HH:mm")}, </span>
            <span className="text-grey-500">
              {dayjs(createdAt).format("DD/MM/YYYY ")}
            </span>
          </div>
          <div className="text-green-500 font-bold">
            {passed ? "Passed" : ""}
          </div>
        </div>
      </div>

      <HDivider extraClass="my-4" />
    </div>
  );
};
export default ActivityItem;
