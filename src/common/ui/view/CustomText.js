import { Link } from "react-router-dom";

export const IconTextLink = ({ icon,text,link,isHover=false }) => {
    return (
        <Link to={link} className="dropdown-item ai-icon">
        <svg
          id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary me-1"
          width={18} height={18} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
        <span className="ms-2">{text} </span>
      </Link>
    );
   };

   export const ParaText = ({text,maxLine=2 ,color,style,fotsize}) => {
    return (
     <p>{text}</p>
    )
   };

   
   export const SansTextMedium = ({text,maxLine=2 ,color,style,fotsize}) => {
    return (
     <p>{text}</p>
    )
   };

   
   export const SansTextBold = ({text,maxLine=2 ,color,style,fotsize}) => {
    return (
     <p>{text}</p>
    )
   };

   
   
   export const PopinTextMedium = ({text,maxLine=2 ,color,style,fotsize}) => {
    return (
     <p>{text}</p>
    )
   };

 
   
   export const PopinTextBold= ({text,maxLine=2 ,color,style,fotsize}) => {
    return (
     <p>{text}</p>
    )
   };

