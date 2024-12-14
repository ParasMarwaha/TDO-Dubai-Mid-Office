export const Server_URL = `http://192.168.29.172:4000/`;
export const Server_URL_FILE = `http://192.168.29.172:4000`;

// export const Server_URL = `http://157.119.40.184/`; // production server ip
// export const Server_URL_FILE = `http://157.119.40.184`; // production server ip
//
/* --------------------------------------------------------- */

export const adminAuthToken = 'adminAuthToken';

/* --------------------------------------------------------- */

export const customStyles = {
    headCells: {
        style: {
            backgroundColor: '#D02824',
            color: '#fff',
            borderBottom: '2px solid #000',
            marginTop: '10px'
        },
    },
    pagination: {
        style: {
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
        },
        pageButtonsStyle: {
            borderRadius: '50%',
            height: '30px',  // Reduced height
            width: '30px',   // Reduced width
            padding: '4px',  // Adjusted padding
            margin: '0 2px',
            cursor: 'pointer',
            transition: '0.3s',
            backgroundColor: '#D02824',  // Updated background color
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover:not(:disabled)': {
                backgroundColor: '#A02018', // Slightly darker shade for hover effect
            },
            '&:disabled': {
                cursor: 'not-allowed',
                color: '#ccc',
                backgroundColor: '#e0e0e0',
            },
            '& svg': {
                color: '#fff', // Arrow icons color
                width: '18px', // Adjust the size as needed
                height: '18px', // Adjust the size as needed
            },
        },
    },
};
