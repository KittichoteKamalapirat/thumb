import CreateTest from "../components/CreateTest";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";

const CreateTestPage = () => {
  return (
    <Layout>
      <PageHeading heading="Create an AB testing" />

      <CreateTest />
    </Layout>
  );
};
export default CreateTestPage;
