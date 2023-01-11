import { BsInboxesFill } from "react-icons/bs";
import { FaFan } from "react-icons/fa";
import { GiWaterRecycling } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { ICON_SIZE } from "../../constants";
import { useWashWithoutStoringMutation } from "../../generated/graphql";
import { showToast } from "../../redux/slices/toastReducer";
import { primaryColor } from "../../theme";
import { ENDO_STATUS } from "../../utils/statusToColor";
import Button, { ButtonTypes } from "../Buttons/Button";
import LinkButton from "../Buttons/LinkButton";


interface Props {
  pickEndo: any;
  refetchEndos: any;
  row: any;
}
const ActionColumn = ({ pickEndo, refetchEndos, row }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [washWithoutStoring] = useWashWithoutStoringMutation()

  const handleUseEndo = async (id: string) => {
    try {
      await pickEndo({ variables: { id } });
      await refetchEndos(); // refetch so the link to /wash/null => /wash/session_id
      dispatch(
        showToast({
          message: "Using the endoscope!",
          variant: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          message: "An error occured",
          variant: "error",
        })
      );
    }
  };


  const handleRewash = async(id: string) => {
    try {  
      const result = await washWithoutStoring({variables: {id}})

      const sessionId = result.data?.washWithoutStoring.id
      await refetchEndos()
      navigate(`/session/${sessionId}`, {
      state: { prev: "/" },
    });
      
    } catch (error) {
      dispatch(
        showToast({
          message: "An error occured!",
          variant: "error",
        })
      );
      
    }
  

    

  }
  // 'ready', => use
  // 'expire_soon', => use
  //  'being_used', => wash
  //  'expired', => wash
  //  'leak_test_failed', => washing
  //  'leak_test_passed', => washing
  //  'disinfection_passed', => washing
  //  'disinfection_failed', => washing
  //  'drying', => drying

  const currentStatus = row.original.status;
  const endoId = row.original.id as string;

  const isConnected = row.original.tray.container.isConnected;
  if (!isConnected) return <div className="text-grey-500">Offline</div>;

  switch (currentStatus) {
    case ENDO_STATUS.EXPIRE_SOON:
    case ENDO_STATUS.READY:
      return <Button label="Pick" onClick={() => handleUseEndo(endoId)} />;

    case ENDO_STATUS.EXPIRED:
      return <Button label="Take out and wash" onClick={() => handleUseEndo(endoId)} />;

    case ENDO_STATUS.BEING_USED:
    case ENDO_STATUS.EXPIRED_AND_OUT:
    case ENDO_STATUS.LEAK_TEST_FAILED:
      return (
        <LinkButton
          leftIcon={<GiWaterRecycling size={ICON_SIZE} color={primaryColor} />}
          label="Wash"
          href={`/session/${row.original.currentSessionId}`}
          type={ButtonTypes.SECONDARY}
        />
      );

    case ENDO_STATUS.LEAK_TEST_PASSED:
    case ENDO_STATUS.DISINFECTION_FAILED:
      return (
        <LinkButton
          label="Disinfect"
          href={`/session/${row.original.currentSessionId}`}
          type={ButtonTypes.SECONDARY}
        />
      );

    case ENDO_STATUS.DISINFECTION_PASSED:
      return (
       <div className="flex flex-col gap-2">
         <LinkButton
          label="Store"
          href={`/session/${row.original.currentSessionId}`}
          type={ButtonTypes.SECONDARY}
          leftIcon={<BsInboxesFill size={ICON_SIZE - 2} color={primaryColor} />}
        />
        {/* Combine Use and wash */}
         <Button
          label="Rewash"
          onClick={() => handleRewash(endoId)}
          type={ButtonTypes.SECONDARY}
          startIcon={<GiWaterRecycling size={ICON_SIZE} color={primaryColor} />}
          
        />
       </div>
      );
    case ENDO_STATUS.DRYING:
      return (
        <div className="flex items-center gap-1">
          <FaFan className="animate-spin-slow" /> <p>Drying</p>
        </div>
      );

    default:
      return null;
  }
};

export default ActionColumn;
