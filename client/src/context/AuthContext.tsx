// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const apiUrl = import.meta.env.VITE_SERVER_URL;

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            console.log(data)
            setUser(data.user);
        } catch (error) {
            console.log(error);

        }

    };

    const logout = () => {
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};