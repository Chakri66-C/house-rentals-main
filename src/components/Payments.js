import * as React from 'react';
import Sidebar from './Sidebar';
import { Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { getAllUserPayments } from './ServerRequests';

function Payments() {
    const hasApplied = true;
    const [payments, setPayments] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [paymentType, setPaymentType] = React.useState('');
    const [cardNumber, setCardNumber] = React.useState('');
    const [expiryDate, setExpiryDate] = React.useState('');
    const [cvv, setCvv] = React.useState('');

    React.useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        getAllUserPayments(userId).then(data => {
            setPayments(data.payments);
        }).catch(error => console.error('Failed to fetch payments:', error));
    }, []);

    const handleClickOpen = (paymentType) => {
        setOpen(true);
        setPaymentType(paymentType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'cardNumber') {
            setCardNumber(value);
        } else if (name === 'expiryDate') {
            setExpiryDate(value);
        } else if (name === 'cvv') {
            setCvv(value);
        }
    };

    const updatePayment = async (paymentType, transactionId) => {
        try {
            const response = await fetch(`/api/updatePayment/${paymentType}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'Paid',
                    transactionId: transactionId
                })
            });
            const data = await response.json();
            if (response.ok) {
                setPayments(data.payments);
                alert(`Payment has been made successfully. Transaction ID: ${transactionId}`);
            } else {
                alert(`Failed to update payment: ${data.message}`);
            }
        } catch (error) {
            console.error('Failed to update payment:', error);
            alert('An error occurred while processing the payment.');
        }
    };

    const handlePay = () => {
        const randomTransaction = Math.floor(1000 + Math.random() * 9000); // Generate a random transaction ID
        const transactionId = `TX${randomTransaction}`;
        updatePayment(paymentType, transactionId);
        setOpen(false);
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName={localStorage.getItem('fullName')} />
            <div className="dflex jc-around" style={styles.mainContent}>
                <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
                    {!hasApplied ?
                        <div className="w100 tcenter">
                            <h3> You have not applied to any Apartments. </h3>
                        </div>
                        :
                        //Conditional Rendering
                        <div>
                            <h2>Lease Payments</h2>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="lease payments table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }} align="right">Amount</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }} align="right">Status</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }} align="right">Transaction Details</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }} align="right">Pay Now</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {payments && Object.entries(payments).map(([key, payment]) => {
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell component="th" scope="row">{payment.description}</TableCell>
                                                    <TableCell align="right">${payment.amount}</TableCell>
                                                    <TableCell sx={{ color: payment.status === "Paid" ? "green" : "red", fontWeight: "bold" }} align="right">
                                                        {payment.status}
                                                    </TableCell>
                                                    <TableCell align="right">{payment.transactionId?.toUpperCase()}</TableCell>
                                                    <TableCell align="right">
                                                        {payment.status !== "Paid" &&
                                                            <Button onClick={() => handleClickOpen(payment._id)}>Pay Now</Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="cardNumber"
                                        name="cardNumber"
                                        label="Card Number"
                                        type="text"
                                        fullWidth
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="expiryDate"
                                        name="expiryDate"
                                        label="Expiry Date (MM/YY)"
                                        type="text"
                                        fullWidth
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="cvv"
                                        name="cvv"
                                        label="CVV"
                                        type="text"
                                        fullWidth
                                        onChange={handleInputChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handlePay} disabled={!cardNumber || !expiryDate || !cvv} color="primary">Pay</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
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
        padding: '30px'
    }
}

export default Payments;
