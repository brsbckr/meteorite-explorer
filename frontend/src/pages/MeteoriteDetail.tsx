import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Typography, CircularProgress, Paper, Breadcrumbs } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

interface Meteorite {
    id: number;
    name: string;
    recclass: string;
    mass?: number;
    fall: string;
    year?: number;
    reclat?: number;
    reclong?: number;
}

const fetchMeteorite = async (id: string): Promise<Meteorite> => {
    const response = await axios.get(`http://192.168.10.8:8080/api/meteorites/${id}`);
    return response.data;
};

const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const MeteoriteDetail = () => {
    const { id } = useParams<{ id: string }>();

    const { data: meteorite, isLoading, error } = useQuery<Meteorite>({
        queryKey: ["meteorite", id],
        queryFn: () => fetchMeteorite(id!),
        enabled: !!id,
    });

    if (isLoading) return <CircularProgress />;
    if (error || !meteorite) return <Typography color="error">Meteorite not found.</Typography>;

    return (
        <Container>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>☄️ Meteorite List</Link>
                <Typography color="textPrimary">{meteorite.name}</Typography>
            </Breadcrumbs>

            <Typography variant="h4" sx={{ my: 3 }}>
                {meteorite.name} Details
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Typography><b>Class:</b> {meteorite.recclass}</Typography>
                <Typography><b>Mass:</b> {meteorite.mass ?? "N/A"} g</Typography>
                <Typography><b>Fall Type:</b> {meteorite.fall}</Typography>
                <Typography><b>Year:</b> {meteorite.year ?? "Unknown"}</Typography>
            </Paper>

            {meteorite.reclat && meteorite.reclong && (
                <MapContainer center={[meteorite.reclat, meteorite.reclong]} zoom={4} style={{ height: "400px", marginTop: "20px" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[meteorite.reclat, meteorite.reclong]} icon={defaultIcon}>
                        <Popup>{meteorite.name}</Popup>
                    </Marker>
                </MapContainer>
            )}
        </Container>
    );
};

export default MeteoriteDetail;