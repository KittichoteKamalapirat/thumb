import Button from "../components/Buttons/Button";
import { createHelloPubsub } from "../firebase/client";

interface Props {}

const Xxx = ({}: Props) => {
  //   useEffect(() => {
  //     const onSubmit = async () => {
  //       try {
  //         const docId = await createTesting("UCR1-y0yMG0onXbQXxoT8QdQ", {
  //           durationType: "specific",
  //           variationThumbUrl:
  //             "http://localhost:9199/v0/b/thumb-be832.appspot.com/o/files%2Frain-profile-02.png?alt=media&token=63a59b93-57ab-4672-afe5-55cadc158507",
  //           videoId: "dbf0Y19pqL4",
  //           originalThumbUrl: "", // todo
  //           duration: 3,
  //         });
  //         console.log("doc id ", docId);
  //       } catch (error) {
  //         console.log("error inside  catch", error);
  //       }
  //     };
  //     onSubmit();
  //   }, []);
  // console.log('jhi'
  const handler = async () => {
    console.log("1");
    await createHelloPubsub();
    console.log("2");
  };
  console.log("hi");
  return (
    <div>
      <Button label="create hello pubsub" onClick={handler} />
    </div>
  );
};
export default Xxx;
