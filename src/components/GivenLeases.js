import * as React from 'react';
import { Paper, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Link, Menu, MenuItem } from '@mui/material';
import Sidebar from './Sidebar';
import data from './../components-data/ApartmentData';

import { fetchAllLeases, terminateLease } from './ServerRequests';
import { TerminalOutlined } from '@mui/icons-material';

function GivenLeases() {
    const [leases, setLeases] = React.useState([]);

    React.useEffect(() => {
        fetchLeases();
    }, []);

    const fetchLeases = () => {
        fetchAllLeases()
            .then(data => {
                setLeases(data);
            })
            .catch(err => {
                console.error(err);
            });
    };
    

    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedLease, setSelectedLease] = React.useState(null);

    const handleMenuOpen = (event, lease) => {
        setAnchorEl(event.currentTarget);
        setSelectedLease(lease);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTerminateLease = (id) => {
        // Implement termination logic here
 
        terminateLease(id).then(data => {
            setLeases(data);
        }).catch(error => console.error('Failed to fetch payments:', error));
        alert("Lease Terminated successfully. ");
        fetchLeases();
        console.log("Lease terminated:", selectedLease);
        handleMenuClose();
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName={localStorage.getItem('fullName')} />
            <div className="dflex jc-around" style={styles.mainContent}>
                <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
                <h3>List of Current Leases</h3>
                    {
                        leases.length ==0 && 
                        <h4> There are no leases right now. Please come back Later.</h4>
                    }
                    { leases.length !==0 &&
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Apartment Number</TableCell>
                                        <TableCell>Flat Number</TableCell>
                                        <TableCell>User Name</TableCell>
                                        <TableCell>User Contact</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leases?.length > 0 && leases.map((lease, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{lease.apartmentDetails.apartmentNumber}</TableCell>
                                            <TableCell>{lease.apartmentDetails.flatNumber}</TableCell>
                                            <TableCell>
                                                {lease.User.firstName}
                                            </TableCell>
                                            <TableCell>
                                                {lease.User.email}
                                            </TableCell>
                                            <TableCell>
                                                
                                                    <Button onClick={() => handleTerminateLease(lease._id)}>Terminate Lease</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Paper>
            </div>
        </div>
    );
}



const styles = {
    mainContent: {
        flex: 1,
        marginLeft: '200px',
        padding: '32px'
    }
};

export default GivenLeases;
