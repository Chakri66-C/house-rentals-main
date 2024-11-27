import {Paper, Button } from '@mui/material'
import * as React from 'react';
import Sidebar from './Sidebar';
import Carousel from './Carousel';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody,  Select, MenuItem} from '@mui/material';

import { getAllStatuses, updateStatus} from './ServerRequests';

function UpdateStatus(){
    const columns = [
        "apartmentNumber", "flatNumber", "status", "appliedBy"
    ]

    const [updatedData, setUpdatedData] = React.useState([]);

    React.useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        getAllStatuses(userId).then(data => {
            setUpdatedData(data);
        }).catch(error => console.error('Failed to fetch payments:', error));
    }, []);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
      
      const handleClickUser = (index) => {

        const record = {
            name : updatedData[index].userName,
            email : updatedData[index].email,
            phone : updatedData[index].phoneNumber,
            income : updatedData[index].income
        }

          setSelectedUser(record);
          setOpenDialog(true);
      };
      
      const handleCloseDialog = () => {
          setOpenDialog(false);
      };

    const handleChangeStatus = (event, index) => {

        const updatedStatus = event.target.value;
        const newData = [...updatedData]; // Create a copy of updatedData
        
        const flatNumber = updatedData[index].flatNumber;
        const apartmentNumber = updatedData[index].apartmentNumber;

        updateStatus(flatNumber, apartmentNumber, updatedStatus).then(data => {
            alert("Status updated successfully");
        }).catch(error => console.error('Failed to fetch payments:', error));

        newData[index] = { ...newData[index], "status": updatedStatus }; // Update the status of the specific row
        setUpdatedData(newData); // Update the state
      };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName={localStorage.getItem('fullName')}/>
            <div className="dflex jc-around" style={ styles.mainContent}>
                <Paper elevation={5} sx={{width : "80%", padding : "32px"}}>
                    <h2> Current Lease Statuses </h2>
                    <Table>
                    <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                        <TableCell key={index}>{column}</TableCell>
                        ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {updatedData?.length>0 && updatedData.map((row, index) => (
                        <TableRow key={index}>
                        {columns.map((column, columnIndex) => (
                            <TableCell sx={{fontWeight: "bold"}} key={columnIndex}>
                            {column === "status" ? (
                              <Select
                                value={row[column]}
                                onChange={(event) => handleChangeStatus(event, index)}
                              >
                                <MenuItem value="applied">Applied</MenuItem>
                                <MenuItem value="underReview">Under Review</MenuItem>
                                <MenuItem value="partiallyApproved">Partially Approved</MenuItem>
                                <MenuItem value="verified">Verified</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Declined</MenuItem>
                              </Select>
                            ) : ( column === "appliedBy" ? <a onClick={() => handleClickUser(index)} href="#"> {row["userName"]} </a>: row[column])}
                          </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                    <Dialog sx={{ width : "100%"}} open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogContent>
                            {selectedUser && (
                                <div>
                                    <p><strong>User Name:</strong> {selectedUser.name}</p>
                                    <p><strong>User Email:</strong> { selectedUser.email}</p>
                                    <p><strong>User Phone:</strong> {selectedUser.phone}</p>
                                    <p><strong>User Income:</strong> {selectedUser.income}</p>
                                    {/* Add more user details here if needed */}
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Table>
                </Paper>
            </div>
        </div>
    )
}

const styles = {
    mainContent : {
        flex : 1,
        marginLeft : '200px',
        padding : '32px'
    }
}

export default UpdateStatus;