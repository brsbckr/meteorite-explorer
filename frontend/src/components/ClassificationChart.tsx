import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CircularProgress, Typography, Paper } from "@mui/material";

// Fetch Classification Data
const fetchClassificationBreakdown = async () => {
    const response = await axios.get("http://192.168.10.8:8080/api/meteorites/stats/classification");
    return Object.entries(response.data).map(([classification, count]) => ({
        classification,
        count: count as number,
    }));
};

const ClassificationChart = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["classificationBreakdown"],
        queryFn: fetchClassificationBreakdown,
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Failed to load classification breakdown.</Typography>;

    return (
        <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6">🔬 Meteorite Classification Breakdown</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classification" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default ClassificationChart;