import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Pagination,
} from "@mui/material";

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

interface MeteoriteApiResponse {
    content: Meteorite[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

interface SearchFilters {
    name?: string;
    recclass?: string;
    year?: number;
    fall?: string;
    minMass?: number;
    maxMass?: number;
}

const fetchMeteorites = async (filters: SearchFilters, page: number, size: number = 10): Promise<MeteoriteApiResponse> => {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.recclass) params.append("recclass", filters.recclass);
    if (filters.year) params.append("year", filters.year.toString());
    if (filters.fall) params.append("fall", filters.fall);
    if (filters.minMass) params.append("minMass", filters.minMass.toString());
    if (filters.maxMass) params.append("maxMass", filters.maxMass.toString());

    params.append("page", (page - 1).toString()); // Convert to 0-based index
    params.append("size", size.toString());

    const response = await axios.get<MeteoriteApiResponse>(`http://192.168.10.8:8080/api/meteorites/search?${params.toString()}`);
    return response.data;
};

const MeteoriteList = () => {
    const [filters, setFilters] = useState<SearchFilters>({});
    const [page, setPage] = useState<number>(1);
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery<MeteoriteApiResponse>({
        queryKey: ["meteorites", filters, page],
        queryFn: () => fetchMeteorites(filters, page),
        staleTime: 5000,
    });

    // Handle input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3 }}>
                Meteorite Explorer
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => navigate("/dashboard")}
            >
                View Meteorite Trends
            </Button>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">🔍 Search & Filter</Typography>
                <TextField label="Name" name="name" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Class" name="recclass" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Year" name="year" type="number" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Fall Type" name="fall" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Min Mass (g)" name="minMass" type="number" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Max Mass (g)" name="maxMass" type="number" fullWidth sx={{ mb: 2 }} onChange={handleChange} />

                <Button variant="contained" color="primary" fullWidth onClick={() => setPage(1)}>
                    Search
                </Button>
            </Paper>

            {isLoading && <CircularProgress />}
            {error && <Typography color="error">Failed to load meteorites.</Typography>}

            {data?.content && data.content.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Class</b></TableCell>
                                <TableCell><b>Mass (g)</b></TableCell>
                                <TableCell><b>Fall</b></TableCell>
                                <TableCell><b>Year</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.content.map((meteorite) => (
                                <TableRow
                                    key={meteorite.id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/meteorite/${meteorite.id}`)}
                                >
                                    <TableCell>{meteorite.name}</TableCell>
                                    <TableCell>{meteorite.recclass}</TableCell>
                                    <TableCell>{meteorite.mass ?? "N/A"}</TableCell>
                                    <TableCell>{meteorite.fall}</TableCell>
                                    <TableCell>{meteorite.year ?? "Unknown"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography sx={{ mt: 2 }}>No results found.</Typography>
            )}

            {data?.totalPages && data.totalPages > 1 && (
                <Pagination
                    count={data.totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                />
            )}
        </Container>
    );
};

export default MeteoriteList;