import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MeteoriteList from "./pages/MeteoriteList";
import MeteoriteDetail from "./pages/MeteoriteDetail";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<MeteoriteList />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/meteorite/:id" element={<MeteoriteDetail />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;