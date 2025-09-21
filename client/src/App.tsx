
import { Route, Routes } from "react-router-dom";
import Todos from "./Pages/Todos";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {


    return (
        <Routes>
            <Route path="/" element={<Todos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

        </Routes>
    );
}

export default App;
