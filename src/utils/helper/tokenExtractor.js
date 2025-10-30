export const tokenExtractor = () => {
  const decodedtoken = JSON.parse(
    window.atob(localStorage.getItem("access_token")?.split(".")[1])
  );
  if (decodedtoken) {
    try {
      return decodedtoken;
    } catch (error) {}
  } else {
    console.log("No token found in localStorage");
  }
};
