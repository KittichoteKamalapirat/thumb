import React from "react";
import Button from "../components/Buttons/Button";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";

interface Props {}

const Testings = ({}: Props) => {
  return (
    <Layout>
      <div className="flex justify-between">
        <PageHeading heading="Manage AB Tests" />

        <Button label="Create AB Tests" href="/create-test" />
      </div>
    </Layout>
  );
};
export default Testings;
