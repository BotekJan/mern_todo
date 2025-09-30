// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
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
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_SERVER_URL;


    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`${apiUrl}/auth/me`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    const data = await res.json();
                    setUser(data.user);
                    console.log(data.user)

                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            };

            fetchUser();
        }
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                setUser(data.user);
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        const response = await fetch(`${apiUrl}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        console.log(response)
        setUser(null);
        localStorage.removeItem("accessToken")
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};