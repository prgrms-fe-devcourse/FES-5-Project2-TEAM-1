import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import './ToastOverride.css';
// import T from './ToastProvider.module.css'
import { ToastContext } from './ToastContext';

export interface ToastContextValue {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

function ToastProvider({ children }: {children: React.ReactNode}) {

    const success = (message: string) => toast.success(message);
    const error = (message: string) => toast.error(message);
    const info = (message: string) => toast.info(message);
    const warning = (message: string) => toast.warning(message);

    return (
        <ToastContext.Provider value={{ success, error, info, warning}}>
        {children}
        <ToastContainer
            autoClose={2000} 
            position='top-center'
            hideProgressBar={true}

        /> 
        </ToastContext.Provider>
    )
}

export default ToastProvider
