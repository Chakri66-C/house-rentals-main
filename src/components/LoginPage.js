import * as React from 'react';

import { useNavigate } from 'react-router-dom';

import Header from "./Header";
import Footer from "./Footer";
import { TextField, Button, Container, Typography } from '@mui/material';

import { withRouter } from 'react-router-dom'; //library used for navigation and routing in React applications.

import { loginUser, registerUser } from './ServerRequests';

const useStyles = { // object to define styling rules in a React component.
  root: { //root: key or "class" name ex: A div or container that serves as the root of a component
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '50%', // Fix IE 11 issue.
  },
  submit: {
    marginTop : "5%",
    marginBottom : "5%",
  },
  toggleBtn : {
    margin : "12px 0px"
  }
};

function LoginPage(){

  let navigate = useNavigate();

  if( localStorage.getItem('isLoggedIn') ){
    window.location.href = '/home'
  }

  const [type, setType] = React.useState('login')

  const toggleButton = () => {
    setType(type == 'login' ? 'register' : 'login')
  }

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleLoginSubmit = async (event) => {
      event.preventDefault(); // prevent the default operation for form  submision

      try {
        const response = await loginUser(userEmail, password); //login user:async func, arguments: email & pswd
        if( response.message=== 'User logged in successfully'){
          localStorage.setItem('isAdmin',response.user.isAdmin);// store user-related data in the browser's local storage
          localStorage.setItem('userId', response.user.userId);
          localStorage.setItem('fullName', response.user.fullName);
          window.location.href = '/home';
        }
        else{
          alert(response.message);
        }
      } catch (error) {
        alert("An error occurred during login:", error);
      }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault(); // prevent the default operation for form  submision
    const payload = { //object: payload contains properties
      firstName : firstName,
      lastName : lastName,
      email : userEmail,
      password : password,
      isAdmin : false,
      phoneNumber : mobileNumber,
      currentAddress : '123',
      annualIncome : '000'
    }
    const response = await registerUser(payload); // payload has package of information sent to the registerUser
    console.log(response);
    alert(response.message);
    if( response.message === "User signed up successfully" ){
      setType('login');
    }
  };

  
   
    return (
        <>
            <Header hasLoginBtn={false}/>
            { type == 'login' ?
                <div className="w100 tcenter"> 
                    <h1>Login </h1> 
                    <div className="dflex jc-around">
                    <form style={useStyles.form} onSubmit={handleLoginSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userEmail"
                            label="Email Address"
                            name="userEmail"
                            autoComplete="email"
                            autoFocus
                            value={userEmail}
                            onChange={handleEmailChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            
                            style={useStyles.submit}
                        >
                            Sign In
                        </Button>
                        </form>
                    </div>

                    <a href="#" className="mx-4" onClick={toggleButton}> Don't have an Account ? Register </a>
                </div>
                : //Else Register Page
                <div className="w100 tcenter">
                    <h1>Register </h1>
                    <div className="dflex jc-around">
                    <form style={useStyles.form} onSubmit={handleRegisterSubmit}>
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="given-name"
                        autoFocus
                        value={firstName}
                        onChange={handleFirstNameChange}
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={handleLastNameChange}
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userEmail"
                        label="Email Address"
                        name="userEmail"
                        autoComplete="email"
                        value={userEmail}
                        onChange={handleEmailChange}
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="mobileNumber"
                        label="Mobile Number"
                        name="mobileNumber"
                        autoComplete="tel"
                        value={mobileNumber}
                        onChange={handleMobileNumberChange}
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={handlePasswordChange}
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        />
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={useStyles.submit}
                        >
                        Register
                        </Button>
                    </form>
                    </div>
                    <a href="#" className="mx-4" onClick={toggleButton}> Already have an Account ? Login </a>
                </div>
            }
            <Footer/>
        </>
    )
}


export default LoginPage;