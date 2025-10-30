import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PageTitle from "../../../jsx/layouts/PageTitle";
import ExcelUsers from "./ExcelUsers";
import ManualForm from "./ManualForm";
import ShareForm from "./ShareForm";

const CreateNewUser = () => {
  const [addCard, setAddCard] = useState(false);
  const [showExcel, setShowExcel] = useState(false);
  return (
    <>
      <PageTitle
        activeMenu="User"
        motherMenu="Add"
        Button={() => (
          <>
            {/* <Button
              className="m-2"
              onClick={() => {
                setShowExcel((prev) => !prev);
                setAddCard(false);
              }}
            >
              {showExcel ? "Manual Form" : "Import Excel"}
            </Button> */}
            <Button
              className="m-2"
              onClick={() => {
                setAddCard(true);
              }}
            >
              Share Registration Form
            </Button>
          </>
        )}
      />

      {addCard && <ShareForm addCard={addCard} setAddCard={setAddCard} />}

      {/* {showExcel ?
       <ExcelUsers /> 
      :  */}
      {<ManualForm />}
    </>
  );
};

export default CreateNewUser;
