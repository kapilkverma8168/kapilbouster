import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (type = "info", message) => {
  const config = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "info":
      toast.info(message, config);
      break;
    default:
      toast(message, config);
  }
};

export default notify;
