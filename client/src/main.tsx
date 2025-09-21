import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@picocss/pico/css/pico.min.css';
import "../styles/tailwind.css"
import "./index.css"


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className='flex justify-center items-center mt-[100px]'>

            <App />
        </div>
    </StrictMode>,
)
