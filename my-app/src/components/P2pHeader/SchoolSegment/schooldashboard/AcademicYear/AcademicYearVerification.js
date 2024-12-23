import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import AppTheme from './shared-theme/AppTheme'; // Ensure this path is correct
import './academicYearVerify.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '90%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundColor: '#33333380',
    // backgroundImage:
    //   'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%, 0.5), hsl(0, 0%, 100%, 0.5))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function SignIn(props) {
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
  const [otpError, setOtpError] = React.useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = React.useState('');
  const [resendEnabled, setResendEnabled] = React.useState(false);
  const [seconds, setSeconds] = React.useState(15);
  const [timerActive, setTimerActive] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);

  React.useEffect(() => {
    if (timerActive && seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0) {
      setResendEnabled(true);
      setTimerActive(false);
    }
  }, [seconds, timerActive]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mobileError || otpError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      mobile: data.get('mobile'),
      otp: data.get('otp'),
    });

    if (!otpSent) {
      setOtpSent(true);
      setResendEnabled(false);
      setSeconds(15);
      setTimerActive(true);
    } else {
      // Add logic to confirm OTP here
      console.log('OTP confirmed');
    }
  };

  const validateInputs = () => {
    const mobile = document.getElementById('mobile');
    const otp = document.getElementById('otp');

    let isValid = true;

    if (!mobile.value || !/^\d{10}$/.test(mobile.value)) {
      setMobileError(true);
      setMobileErrorMessage('Please enter a valid mobile number.');
      isValid = false;
    } else {
      setMobileError(false);
      setMobileErrorMessage('');
    }

    if (!otp.value || otp.value.length !== 6) {
      setOtpError(true);
      setOtpErrorMessage('OTP must be 6 digits long.');
      isValid = false;
    } else {
      setOtpError(false);
      setOtpErrorMessage('');
    }

    return isValid;
  };

  const handleResend = () => {
    setResendEnabled(false);
    setSeconds(15);
    setTimerActive(true);
    // Add logic to resend OTP here
  };

  return (
    <AppTheme {...props}>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={props.onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            component="h1"
            variant="h4"
            className='verify-title'
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Verify the mobile number to start a new academic journey 🎓📖✈️
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 3,
            }}
          >
            <FormControl className='verify-form'>
              <FormLabel htmlFor="mobile">Mobile Number</FormLabel>
              <TextField
                error={mobileError}
                helperText={mobileErrorMessage}
                id="mobile"
                type="tel"
                name="mobile"
                placeholder="1234567890"
                autoComplete="tel"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={mobileError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="otp">OTP</FormLabel>
              <TextField
                error={otpError}
                helperText={otpErrorMessage}
                name="otp"
                placeholder="123456"
                type="text"
                id="otp"
                autoComplete="one-time-code"
                required
                fullWidth
                variant="outlined"
                color={otpError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              onClick={handleResend}
              disabled={!resendEnabled}
              variant="text"
            >
              Resend OTP {resendEnabled ? '' : `(${seconds}s)`}
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              {otpSent ? 'Confirm OTP' : 'Send OTP'}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}