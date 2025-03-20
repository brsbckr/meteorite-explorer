import {Container, Typography, Paper, Breadcrumbs} from "@mui/material";
import MeteoriteTrends from "../components/MeteoriteTrends";
import ClassificationChart from "../components/ClassificationChart";
import MassDistributionChart from "../components/MassDistributionChart";
import {Link} from "react-router-dom";

const Dashboard = () => {
    return (
        <Container>
            <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>☄️ Meteorite List</Link>
                <Typography color="textPrimary">📊 Meteorite Trends</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ my: 3, textAlign: "center" }}>
                Meteorite Dashboard
            </Typography>

            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Meteorite Landings Trends</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    This chart shows the number of meteorite landings recorded over the years.
                </Typography>
                <MeteoriteTrends />
            </Paper>

            <MassDistributionChart />
            <ClassificationChart />
        </Container>
    );
};

export default Dashboard;