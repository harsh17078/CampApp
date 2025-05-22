import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import {BrowserRouter} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value = {defaultSystem}>
          <App/>
      </ChakraProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
