import * as React from 'react';
import Sidebar from './Sidebar';
import data from './../components-data/ComplaintsData';

import Accordion from '@mui/material/Accordion'; //paper api
import Button from '@mui/material/Button';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { updateComplaints, fetchComplaints } from './ServerRequests.js';

function FixComplaints() {

    React.useEffect(() => {
        const getComplaints = async () =>{
            const response = await fetchComplaints();
            setData(response);
        }
        getComplaints();
    },[])


    const [data, setData] = React.useState(null);



    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);
    const [comment, setComment] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [estimatedDate, setEstimatedDate] = React.useState('');

    const handleOpenDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenDialog(true);
        setComment(complaint.commentFromOwner);
        setStatus(complaint.status);
        setEstimatedDate(complaint.estimatedDate || '');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleEstimatedDateChange = (event) => {
        setEstimatedDate(event.target.value);
    };

    const handleSaveChanges = async () => {
        // Update comment, status, and estimated date for the selected complaint
        const updatedComplaints = data.map(complaint => {
            if (complaint._id === selectedComplaint._id) {
                return {
                    ...complaint,
                    "commentFromOwner" : comment,
                    "status" : status,
                    "expectedDateToSolve" : estimatedDate
                };
            }
            return complaint;
        });

        const payload = {
            expectedDateToSolve: estimatedDate,
            status: status,
            commentFromOwner: comment
        };  
        console.log(payload);
        console.log(selectedComplaint._id);    
        const response = await updateComplaints( selectedComplaint._id, payload );

        alert("Updated the complaint successfully ");

        setData(updatedComplaints);
        handleCloseDialog();
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Admin" />
            <div style={styles.mainContent}>
                <h2>Fix Complaints</h2>
                <div>
                    <h3>Open Complaints : </h3>
                    { data!=null && data.filter(complaint => complaint.status !== 'Resolved').length == 0 && 
                      <h4> There are No Open Complaints Right now.</h4>
                    }
                    { data!=null && data.filter(complaint => complaint.status !== 'Resolved').map((complaint, index) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <h4>{complaint.complaintTitle}</h4>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <p>Description: {complaint.complaintDescription}</p>
                                    <p>Status: {complaint.status}</p>
                                    <p>Issue Raised: {complaint.raisedTime}</p>
                                    <p> Raised By : { complaint.raisedByName } {complaint.raisedByEmail}</p>
                                    <Button onClick={() => handleOpenDialog(complaint)}>Edit</Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
                <div>
                    <h3>Closed Complaints : </h3>
                    {data!=null && data.filter(complaint => complaint.status === 'Resolved').length == 0 && 
                    <h4> There are no Closed Complaints Right now.</h4>
                    }
                    {data!=null && data.filter(complaint => complaint.status === 'Resolved').map((complaint, index) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                <h4>{complaint.complaintTitle}</h4>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <p>Description: {complaint.complaintDescription}</p>
                                    <p>Status: {complaint.status}</p>
                                    <p>Issue Raised: {complaint.raisedTime}</p>
                                    <p>Issue Solved: {complaint.expectedDateToSolve}</p>
                                    <p>Comment: {complaint.commentFromOwner}</p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Complaint</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Edit the comment, status, and estimated date for the complaint.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comment"
                            type="text"
                            fullWidth
                            value={comment}
                            onChange={handleCommentChange}
                        />
                        <FormControl fullWidth sx={{ marginTop: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <MenuItem value="Received">Recieved</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Resolved">Resolved</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="estimatedDate"
                            label="Estimated Date to Solve"
                            type="date"
                            fullWidth
                            value={estimatedDate}
                            onChange={handleEstimatedDateChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
                    </DialogActions>
                </Dialog>
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

export default FixComplaints;
