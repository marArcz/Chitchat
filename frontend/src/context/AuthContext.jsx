import { getCurrentUser } from '../lib/api';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
const AuthContext = createContext({
    user: null,
    isLoading: false,
    setUser: () => { },
    isAuthenticated: false,
    checkAuthUser: async () => { }
});


const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [cookies] = useCookies([]);
    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if (currentAccount) {
                setUser(currentAccount);
                setIsAuthenticated(true)
                return true;
            }
            setUser(null);
            setIsAuthenticated(false)
            return false;
        } catch (error) {
            console.error(error)
            return false;
        }

    }

    useEffect(() => {
        if (!cookies[import.meta.env.VITE_TOKEN_NAME] || cookies[import.meta.env.VITE_TOKEN_NAME] == 'undefined') {
            navigate('/sign-in')
        }
        checkAuthUser();
    }, []);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default UserAuthProvider

export const useAuthContext = () => useContext(AuthContext);