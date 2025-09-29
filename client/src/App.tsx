
import { Route, Routes } from "react-router-dom";
import Todos from "./Pages/Todos";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import ProtectedRoute from "./utils/ProtectedRoute";
import Test from "./Pages/Test";
import PublicRoute from "./utils/PublicRoute";

function App() {


    return (
        <>
            <h1 className="absolute p-2">BesTo-Do</h1>

            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Todos />
                    </ProtectedRoute>
                } />
                <Route path="/test" element={
                    <ProtectedRoute>
                        <Test />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <Register />

                    </PublicRoute>
                } />

            </Routes>

        </>
    );
}

export default App;
