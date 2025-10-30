export const PurpleButton = ({ btnTitle, onBtnClick }) => {
  return (
    <button
      className='btn btn-sm btn-primary'
      onClick={(e) => {
        onBtnClick(e)
      }}
    >
      {btnTitle}
    </button>
  );
};


export const DTInpurTfiled = ({ btnTitle, onBtnClick,value,onValueChange }) => {
  return (
    <div className="contact-name">
      <input type="text" className="form-control" autoComplete="off"
        name="category" required="required"
        value={value}
        onChange={onValueChange}
        placeholder="name"
      />
      <span className="validation-text"></span>
    </div>
  );
};



export const DTActionDialog = ({ heading,onNegativeBtnClick,onPositiveClick }) => {
  return (
    <div className="contact-name">
      {/* <SansText ={heading}> */}
      <PurpleButton btnTitle={"OK"} onBtnClick={onPositiveClick}/>
      <PurpleButton  btnTitle={"cancel"} onBtnClick={onNegativeBtnClick}/>
      <span className="validation-text"></span>
    </div>
  );
};




export const DTInfoDialog = ({ btnTitle, onBtnClick,value,onValueChange }) => {
  return (
    <div className="contact-name">
      <input type="text" className="form-control" autoComplete="off"
        name="category" required="required"
        value={value}
        onChange={onValueChange}
        placeholder="name"
      />
      <span className="validation-text"></span>
    </div>
  );
};



