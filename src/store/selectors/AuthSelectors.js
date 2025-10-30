export const isAuthenticated = (TokenKey) => {
    console.log("TokenKey",TokenKey);
    if (TokenKey) return true;
    return false;
};
