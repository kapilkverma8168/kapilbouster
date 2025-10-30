import { useState } from "react";

const InsituteVerficationMapping = (insituteData) => {
    console.log("insituteData",insituteData);

    const [insituteVerifyList,setInsituteVerifyList] = useState(
        [
            
            {
                id:1,
                label:"Address",
                value:insituteData.address,
                key:"",
                action:false,
                

            },
            {
                id:1,
                label:"Mobile",
                value:insituteData.mobile,
                key:"",
                action:false,
                

            },
        ]
      );
  
    
  
  };
  
  export default InsituteVerficationMapping;