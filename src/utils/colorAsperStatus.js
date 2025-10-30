export const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}


export const formatLable = (label) => {
    return label.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}


export const getStatusColor = (status) => {
    switch (status) {
        case 'initial':
            return 'purple'
        case 'reject':
            return 'red';
        case 'pass':
            return 'green';
        case 'ask_for_resubmit':
            return '#F2E34C';
         case 'ongoing':
            return 'grey';
          default :
           return 'black'; 
           
    }
}