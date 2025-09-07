import React from "react";
import { useContext, createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const JanContext = createContext();

export const JanProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const location = useLocation();


    const [user, setUser] = useState(undefined);



    const loginFunction = (uid) => {
        localStorage.setItem("UID", uid);
        setUser(uid);
    }

    const logoutFunction = () => {
        localStorage.removeItem("UID");
        setUser(null);
    };

    const validateUser = () => {
        if (!location.pathname === '/login' || !location.pathname === '/register' && !localStorage.getItem("UID")){
            navigate("/login")
        }
    }

    const checkUser = () => {
        if ( (location.pathname === '/login' || location.pathname === '/register') && localStorage.getItem("UID")) {
            setUser(localStorage.getItem("UID"));
            navigate("/")
        }
    }






    const data = { backendUrl, user, loginFunction, logoutFunction, navigate, setUser, checkUser, validateUser }

    useEffect(() => {
        const storedUID = localStorage.getItem("UID");
        if (storedUID) {
            setUser(storedUID);
        } else {
            setUser(null);
        }
    }, []);


    return (
        <JanContext.Provider value={data}>
            {children}
        </JanContext.Provider>
    );
};