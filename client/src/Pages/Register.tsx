import { Link } from "react-router-dom";

export default function Register() {

    return <div className="flex flex-col items-center justify-center h-[90%] gap-8">

        <h1>Register</h1>
        <form className="w-92 flex gap-2 flex-col" action="">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
            <label htmlFor="repeatPassword">Repeat Password</label>
            <input type="password" name="repeatPassword" id="repeatPassword" />
            <button type="submit">Register</button>
        </form>

        <p className="text-xs">Already have an account? <Link to="/login">Log In</Link></p>

    </div>
}