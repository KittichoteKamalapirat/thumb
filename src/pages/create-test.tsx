import classNames from "classnames";
import { ChangeEvent, useState } from "react";
import CreateThumbTest from "../components/CreateThumbTest";
import CreateTitleTest from "../components/CreateTitleTest";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";
import SubHeading from "../components/typography/SubHeading";

import {
  TestingType,
  testingTypeOptions,
} from "../firebase/types/Testing.type";
import {
  ACTION_ACTIVE_CARD_CLASSNAMES,
  ACTION_CARD_CLASSNAMES,
} from "../theme";

const CreateTest = () => {
  const [testType, setTestType] = useState<TestingType>("thumb");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTestType(e.target.value as TestingType);
  };

  return (
    <Layout>
      <PageHeading heading="Create an AB testing" />

      <div data-section="1" className="mt-4">
        <div className="flex gap-2">
          <SubHeading
            heading="Do you want to test a thumbnail or a title"
            extraClass="text-left text-xl mb-4 font-bold"
          />
          <span className="align-sub text-xl text-red-500">*</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {testingTypeOptions.map((option) => (
          <div key={option.value} className="flex col-span-6 md:col-span-4">
            <input
              id={option.value}
              name="testType"
              type="radio"
              value={option.value}
              className="hidden"
              onChange={handleChange}
              checked={testType === option.value}
            />
            <label
              htmlFor={option.value}
              className={classNames(
                "w-full",
                `${
                  testType === option.value
                    ? ACTION_ACTIVE_CARD_CLASSNAMES
                    : ACTION_CARD_CLASSNAMES
                }`
              )}
            >
              <div>{option.label}</div>
            </label>
          </div>
        ))}
      </div>
      {/* {testType === "thumb" && <CreateThumbTest />} */}
      {testType === "title" && <CreateTitleTest />}
    </Layout>
  );
};
export default CreateTest;
