import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CircularProgress, Typography, Paper } from "@mui/material";

// Fetch Meteorite Trends Data
const fetchMeteoriteTrends = async () => {
    const response = await axios.get("http://192.168.10.8:8080/api/meteorites/stats/trends");
    return Object.entries(response.data).map(([year, count]) => ({
        year: parseInt(year),
        count: count as number,
    }));
};

const MeteoriteTrends = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["meteoriteTrends"],
        queryFn: fetchMeteoriteTrends,
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Failed to load trends.</Typography>;

    return (
        <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6">📊 Meteorite Trends Over the Years</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickFormatter={(year) => `${year}`} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default MeteoriteTrends;