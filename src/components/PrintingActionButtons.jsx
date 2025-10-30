import React from "react";
import image from '../images/pic3.jpg';
import id from '../images/id.jpg';

const PrintingActionButtons = ({ 
  item, 
  onPrint, 
  onReprint, 
  onBlock,
  onPreview 
}) => {
  const isPrinted = item.isPrinted;
  const isBlocked = item.isBlocked;

  const reprintDisabled = !isPrinted;
  const reprintTitle = reprintDisabled ? 'Re-print is available only after the first print' : '';

  const handlePreview = () => {
    if (onPreview) {
      onPreview(item);
    } else {
      // Default preview behavior - you can customize this
      console.log("Preview item:", item);
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm handoverbutton"
          onClick={handlePreview}
        >
          Preview
        </button>
        {isPrinted ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled
          >
            Printed
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm viewoverbutton"
            onClick={() => onPrint(item.id)}
            disabled={isBlocked}
          >
            Print
          </button>
        )}
      </div>
      <div className="d-flex gap-2">
        <span title={reprintTitle}>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={() => onReprint(item.id)}
            disabled={reprintDisabled}
          >
            Re-print
          </button>
        </span>
        <button
          type="button"
          className={`btn btn-sm ${isBlocked ? 'btn-secondary' : 'btn-danger'}`}
          onClick={() => onBlock(item.id)}
          disabled={isBlocked}
          title={isBlocked ? 'Card is already blocked' : ''}
        >
          {isBlocked ? 'Blocked' : 'Block'}
        </button>
      </div>
    </div>
  );
};

export const formatTableData = (data, onPrint, onReprint, onBlock, onPreview) => {
  return data.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    middleName: item.middleName,
    lastName: item.lastName,
    email: item.email,
    idNumber: item.idNumber,
    phone: item.phone,
    userPhoto: (
      <img
        src={item.userPhoto || image}
        alt=""
        width={55}
        height={55}
        style={{ objectFit: "contain" }}
      />
    ),
    idPhoto: (
      <img
        src={item.idPhoto || id}
        alt=""
        width={55}
        height={55}
        style={{ objectFit: "contain" }}
      />
    ),
    userType: item.userType,
    responsibleOrg: item.responsibleOrg,
    createdBy: item.createdBy,
    action: (
      <PrintingActionButtons
        item={item}
        onPrint={onPrint}
        onReprint={onReprint}
        onBlock={onBlock}
        onPreview={onPreview}
      />
    ),
  }));
};

export default PrintingActionButtons;
