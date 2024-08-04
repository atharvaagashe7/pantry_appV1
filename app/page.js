"use client"

import { Box, Stack, Typography, Button, Modal, TextField, Avatar } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const headerStyle = {
  width: '100%',
  height: '60px',
  bgcolor: '#003366',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  color: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  top: 0,
  zIndex: 1000,
};

const itemBoxStyle = {
  width: '100%',
  minHeight: '150px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  bgcolor: '#e8f4f8',
  borderRadius: 2,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  backgroundColor: '#0066cc', 
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#004d99',
  },
};

const headerTextStyle = {
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const welcomeTextStyle = {
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  textAlign: 'center',
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={'#f4f6f8'}  // Background color
      paddingTop="60px"  // Adjust for fixed header
    >
      <Box sx={headerStyle}>
        <Typography sx={headerTextStyle}>Dashboard</Typography>
        <Typography sx={welcomeTextStyle}>Welcome to your Pantry Tracker!</Typography>
        <Avatar sx={{ bgcolor: '#fff', color: '#003366' }}>AA</Avatar>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography id="modal-title" variant="h6" component="h2">
              Add a New Item
            </Typography>
            <Button onClick={handleClose} sx={{ color: '#000' }}>X</Button>
          </Stack>
          <Stack width="100%" spacing={2} mt={2}>
            <TextField 
              label="Item Name" 
              variant="outlined" 
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button sx={buttonStyle} variant="contained" onClick={handleOpen}>
        Add
      </Button>
    
      <Box border={'2px solid #333'} borderRadius={2} boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)">
        <Box 
          width="800px" 
          height="100px" 
          bgcolor={'#ADD8E6'} 
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius="2px 2px 0 0"
        >
          <Typography variant={'h2'} color={'#003366'} textAlign={'center'} fontWeight="bold">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} p={2}> 
          {pantry.map(({ name, count }) => (
            <Box key={name} sx={itemBoxStyle}> 
              <Typography variant={'h5'} color={'#003366'} textAlign={'center'} fontWeight="bold">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#003366'} textAlign={'center'}>
                {count}
              </Typography>
              <Button sx={buttonStyle} variant="contained" onClick={() => removeItem(name)}>Remove</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
