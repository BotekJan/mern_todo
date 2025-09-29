import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth()
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const username = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        if (!username || !password) {
            alert("Please enter both username and password");
            return;
        }

        login(username, password);
        navigate("/");
    };

    return <div className="flex flex-col items-center justify-center h-[90%] gap-8">

        <h1>Login</h1>
        <form className="w-92 flex gap-2 flex-col" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" ref={emailRef} defaultValue={"user@test.com"} />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" ref={passwordRef} defaultValue={"TestPassword123"} />
            <button type="submit">Login</button>
        </form>

        <p className="text-xs">Don't have an account yet? <Link to="/register">Register</Link></p>

    </div>
}