'use client';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import addTransaction from '../utils/addTransaction';

import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { registryForm } from '../types/types';


export default function Registry() {

  console.log(`Here we go ${process.env.SHEET_ID}`);

  const [registry, setRegistry] = useState<registryForm>({
                          checkNo: "",
                          transaction: "Debit",
                          amount: "0",
                          date: dayjs().toISOString().substring(0, 10),
                          description: "",
                          category: "",
                          submitted: false,
                          error: false
                        });


  let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistry({...registry, 
      [e.target.name] : e.target.value});
  }

  let handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    
    e.preventDefault();
  
    console.log(registry);

    if (registry.date === undefined || registry.description === "" || registry.amount === "") {
      setRegistry({...registry, error:true, submitted:true});
    }

    else {
      const rowAdded = await addTransaction(registry);

      rowAdded ? setRegistry({...registry, error:false, submitted:true})
      : setRegistry({...registry, error:true, submitted:true});
    }

    setTimeout(() => 
      setRegistry((prev) => ({...prev, error:false, submitted:false})), 
    3500);

  }

  let displayAlert = () => {

    if (!registry.submitted)
      return;

    else if (registry.error && registry.submitted)
      return <Alert variant="outlined" severity="error" sx={{textAlign: "center", fontSize: "28px"}}>Fill out all the required fields.</Alert>;

    else
      return <Alert variant="outlined" severity="success" sx={{textAlign: "center", fontSize: "28px"}}>Transaction Uploaded Successfully.</Alert>

  }
 
  return (
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        {displayAlert()}
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
        <Link href="https://docs.google.com/spreadsheets/d/1CLE1a5Eox4Pou9GoeaTRq2h3P35gMS5S4G_KPGo5LFU/edit#gid=0" target="_blank" sx={{textDecoration: "none", textAlign: "center"}}>
            <Typography variant='h2' sx={{color : "#00a88c", fontSize: "80px", mb: 8}}>
                Check Registry
            </Typography>
          </Link>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="checkNo"
              label="Check Number (optional)"
              name="checkNo"
              autoFocus
              sx={{mb: 5}}
              onChange={handleChange}
            />
            <FormLabel id="demo-radio-buttons-group-label">Transaction Type</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Debit"
                name="transaction"
                value={registry.transaction}
                onChange={handleChange}
                sx = {{'& .MuiSvgIcon-root': {
                  fontSize: 36,
                  color: "#00796b"
                },}}
              >
                <FormControlLabel value="Debit" control={<Radio />} label="Debit" />
                <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
              </RadioGroup>
            <Typography mt={3} sx={{color: "#00695c", fontSize: "18px"}}>Amount*</Typography>
            <TextField required fullWidth inputProps=
            {{ type: 'number', min: 0, step: .01}} value={registry.amount} onChange={handleChange} 
            name="amount" color="success"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{mt: 2, mb: 2}}>
                <DatePicker value={dayjs(registry.date)} label="Date" name="date" onChange={(val) => setRegistry({...registry, date: val?.toISOString().substring(0, 10)})}/>
              </DemoContainer>
            </LocalizationProvider>
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Description"
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              name="category"
              label="Category (optional)"
              onChange={handleChange}
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: "24px" }}
            >
              Add Transaction
            </Button>
          </Box>
        </Box>
      </Container>
  );
}