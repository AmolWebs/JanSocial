import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { JanContext } from '../context/JanContext'
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {

    const { user, setUser, checkUser } = useContext(JanContext);


    if (!user) {
        return <Navigate to="/login" />
    }

    useEffect(() => {
        if (localStorage.getItem("UID")) {
            setUser(localStorage.getItem("UID"));
        }
        checkUser();
        if(!user){
            toast.info("Login First to use Application", {
            position: "top-center"
        });
        }
    })

    return children;
};

export default ProtectedRoute
