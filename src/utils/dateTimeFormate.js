
// export const formatDateTime = (dateTime) => {
//     const date = new Date(dateTime);
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
// };

export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    return date.toLocaleDateString('en-GB', options);
};