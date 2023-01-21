import { useContext, useState } from "react";
import { ChannelContext } from "../contexts/ChannelContext";
import { logout } from "../firebase/auth";
// import { createCheckoutSession } from "../stripe/createCheckoutSession";
import Dropdown from "./Dropdown";

interface Props {}

const AuthDisplay = ({}: Props) => {
  const { channel, setChannel } = useContext(ChannelContext);

  const [premiumButtonIsLoading, setPremiumButtonIsLoading] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  const handleSubscribe = async () => {
    if (!channel.channelId) return;
    setPremiumButtonIsLoading(true);
    // await createCheckoutSession(user.uid); // TODO
    setPremiumButtonIsLoading(false);
    return;
  };
  // loading

  // no user
  if (!channel.channelId) return <div>no user</div>;

  return (
    <div>
      {!channel.channelId && (
        <div className="flex items-center">
          {/* {!userIsPremium ? (
            <Button
              type={ButtonTypes.ACTION}
              fontSize="text-md"
              label="Upgrade to premium"
              loading={premiumButtonIsLoading}
              onClick={handleSubscribe}
            />
          ) : (
            <Tag content="🍪 Premium" extraClass="ml-auto" />
          )} */}
          <Dropdown
            isOpen={modalIsOpen}
            onClick={() => setModalIsOpen(!modalIsOpen)}
            items={[
              {
                label: "My Mockups",
                href: "/my-mockups",
              },
              {
                label: "Account",
                href: "/account",
              },

              {
                label: "Pricing",
                href: "/pricing",
              },
              {
                label: "Log out",
                itemOnClick: () => logout(),
              },
            ]}
          >
            Dropdown
          </Dropdown>
        </div>
      )}
    </div>
  );
};
export default AuthDisplay;
