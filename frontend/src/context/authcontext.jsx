import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Try to load from localStorage for persistence
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        } else {
            // 2. Fallback to a default mock user for "Grade Book" demonstration
            const mockUser = {
                name: 'Dr. Gurukul',
                email: 'admin@gkv.ac.in',
                role: 'teacher'
            };
            // We don't save to localStorage automatically here, only on real Login
            setUser(mockUser);
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Save to localStorage so it stays after refresh
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
