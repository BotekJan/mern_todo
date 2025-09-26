
import { Route, Routes } from "react-router-dom";
import Todos from "./Pages/Todos";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {


    return (
        <>
            <h1 className="absolute p-2">BesTo-Do</h1>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Todos />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                </Routes>
            </AuthProvider>
        </>
    );
}

export default App;
