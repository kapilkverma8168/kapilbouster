import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
export const EyePasswordBtn = ({showPassword, setShowPassword}) => {
    return (
        <>
           <button
        className="eyes-button "
        onClick={() => setShowPassword(!showPassword)}
        type="button"
    >
        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
    </button>
        </>
    )
 
}

