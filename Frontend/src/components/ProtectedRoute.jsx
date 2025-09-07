import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { JanContext } from '../context/JanContext'
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {

    const {user, setUser, checkUser} = useContext(JanContext);



    if(!user){
        return <Navigate to="/login" />
    }

    useEffect(()=>{
        if(localStorage.getItem("UID")){
            setUser(localStorage.getItem("UID"));
        }
        checkUser();
    })

    return children;
};

export default ProtectedRoute
