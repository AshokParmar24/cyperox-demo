import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;