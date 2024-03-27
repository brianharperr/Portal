import Landing from "./admin/Landing";
import Login from "./admin/Login";
import { Routes, Route } from "react-router-dom";

export default function AdminRoutes()
{
    return (
        <Routes>
            <Route exact path="/" element={<Landing/>} />
            <Route exact path="/login" element={<Login/>} />
        </Routes>
    )
}