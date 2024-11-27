import * as React from 'react';

import Sidebar from './Sidebar';
import {Paper, Button, TextField } from '@mui/material'
import Carousel from './Carousel';
import LinearProgress from '@mui/joy/LinearProgress';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useParams } from 'react-router-dom';

import { fetchApartmentDetails, submitLeaseApplication } from './ServerRequests';


function ViewApartment(){

    let { id } = useParams();

    const userId = localStorage.getItem('userId');

    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        async function fetchDetails() {
            try {
                const response = await fetchApartmentDetails(id);
                setData(response);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchDetails();

    }, []);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitLease = async (payload) =>{
        console.log("Payload ", payload);
        const response = await submitLeaseApplication(userId, payload);
        console.log("Got response");
        console.log(response);
        alert(response.message);
        // // if( response.status == 200 ){
        // //     if( response.data ){
        // //         alert("Lease was successfully applied");
        // //     }
        // // }
        // else{
        //     alert(response.message)
        // }
    }

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName={localStorage.getItem('fullName')}/>
            <div className="dflex jc-around" style={ styles.mainContent}>
                { data!==null && <Paper elevation={5} sx={{width : "80%", padding : "32px"}}>
                    <Carousel images={data.images}/>
                    <h2>Apartment {data.apartmentNumber} - {data.flatNumber}</h2>
                    {/* <p>Location: {data.address.city}, {data.address.state}</p> */}
                    <p>Price: $ {data.pricePerMonth}/month</p>
                    <p>Bedrooms: {data.bedrooms} | Bathrooms: {data.bathrooms}</p>
                    <p>Description: {data.description}</p>

                    <p> Address : {data.apartmentNumber}-{data.flatNumber} , <br/> {data.address.lane}, <br/> 
                     {data.address.city}, {data.address.state} <br/>
                     {data.address.zip}
                     </p>
                    <p> Owner Name : {data.ownerName} </p>
                    <p> Owner Contact : {data.ownerContact}</p>
                    <div className="w100 tcenter dflex jc-around">
                        <Button variant="outlined" onClick={handleClickOpen}> Apply Now !</Button>
                         
                            <Dialog
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                            component: 'form',
                            onSubmit: (event) => {
                                event.preventDefault(); // prevent the default operation for form  submision
                                const formData = new FormData(event.currentTarget);
                                const formJson = Object.fromEntries(formData.entries());
                                console.log(formJson);
                                try{
                                    const payload = {
                                        apartmentDetailsId : data._id,
                                    }
                                    submitLease( payload );
                                }
                                catch(error){
                                    alert("There was some error, please try after sometime");
                                }
                                handleClose();
                            },
                            }}
                            >
                            <DialogTitle>Enter Your Details</DialogTitle>
                            <DialogContent>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="full-name"
                                name="fullname"
                                label="Full Name"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="email"
                                name="email"
                                label="Email"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="income-amount"
                                name="income"
                                label="Income"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                             <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="no-of-people"
                                name="people"
                                label="No. of People"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="current-addr"
                                name="current-addr"
                                label="Current Address"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit"> Submit </Button>
                            </DialogActions>
                        </Dialog>

                    </div>
                </Paper>
            }
            </div>
        </div>
    )
}

const styles = {
    mainContent : {
        flex : 1,
        marginLeft : '200px',
        padding : '30px'
    }
}

export default ViewApartment;