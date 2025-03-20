import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { CircularProgress, Typography, Paper } from "@mui/material";

// Fetch Mass Distribution Data
const fetchMassDistribution = async () => {
    const response = await axios.get("http://192.168.10.8:8080/api/meteorites/stats/mass-distribution");
    return Object.entries(response.data).map(([category, count]) => ({
        category,
        count: count as number,
    }));
};

// Define colors for pie chart
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61"];

const MassDistributionChart = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["massDistribution"],
        queryFn: fetchMassDistribution,
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Failed to load mass distribution.</Typography>;

    return (
        <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6">⚖️ Meteorite Mass Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data ?? []} // ✅ Ensures `data` is always an array
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {(data ?? []).map((_, index) => ( // ✅ Ensures `data` is not undefined
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default MassDistributionChart;