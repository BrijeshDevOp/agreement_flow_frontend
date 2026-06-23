import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { getStoredUser, clearSession } from '../api/authHelpers';
import {
    Button, Typography, Container, Box, AppBar, Toolbar,
    Grid, Card, CardContent, CardActions, Chip, Divider,
    CircularProgress, Tooltip
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';

const formatStage = (stage) => stage ? stage.replace(/_/g, ' ') : '';

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => getStoredUser());
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            fetchAgreements();
        }
    }, []);

    const fetchAgreements = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/agreements/');
            setAgreements(response.data);
        } catch (err) {
            console.error('Failed to fetch agreements', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreateNew = async () => {
        try {
            await api.post('/agreements/create/', {});
            fetchAgreements();
        } catch (err) {
            console.error('Failed to create agreement', err);
            alert('Error creating agreement. Only Juniors can create new agreements.');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout/');
        } catch (_) { }
        clearSession();
        setUser(null);
        navigate('/');
    };

    if (!user) return null;

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            {/* ---- Top navbar ---- */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        AgreementFlow
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2, opacity: 0.85 }}>
                        {user.username} &bull; <strong>{user.role}</strong>
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ textTransform: 'none' }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 5, pb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Active Workspace</Typography>
                        <Typography variant="body2" color="text.secondary">
                            All agreements in the pipeline
                        </Typography>
                    </Box>

                    {/* Only JUNIOR users can create new agreements */}
                    {user.role === 'JUNIOR' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddCircleIcon />}
                            onClick={handleCreateNew}
                            sx={{ fontWeight: 700 }}
                        >
                            New Draft
                        </Button>
                    )}
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {agreements.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary">
                                    No agreements found in the system yet.
                                </Typography>
                            </Grid>
                        ) : (
                            agreements.map((agreement) => (
                                <AgreementCard
                                    key={agreement.id}
                                    agreement={agreement}
                                    onOpenAct={() => navigate(`/editor/${agreement.id}`)}
                                    onView={() => navigate(`/view/${agreement.id}`)}
                                />
                            ))
                        )}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

// ─── Agreement Card component ─────────────────────────────────────────────────
function AgreementCard({ agreement, onOpenAct, onView }) {
    const isActive = agreement.is_active;

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                elevation={isActive ? 4 : 2}
                onClick={!isActive ? onView : undefined}   // whole card click → view-only
                sx={{
                    borderRadius: 3,
                    transition: 'box-shadow 0.2s, transform 0.15s',
                    cursor: isActive ? 'default' : 'pointer',
                    '&:hover': isActive
                        ? { boxShadow: 6 }
                        : { boxShadow: 8, transform: 'translateY(-2px)' },
                    border: isActive ? '2px solid' : '1px solid #e0e0e0',
                    borderColor: isActive ? 'primary.main' : undefined,
                    position: 'relative',
                }}
            >
                {/* "Action Required" ribbon for active cards */}
                {isActive && (
                    <Box sx={{
                        position: 'absolute', top: 10, right: 10,
                        bgcolor: 'warning.main', borderRadius: 1,
                        px: 1, py: 0.25,
                    }}>
                        <Typography variant="caption" color="white" fontWeight={700}>
                            Action Required
                        </Typography>
                    </Box>
                )}

                <CardContent sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
                    {/* File icon — always shown for everyone */}
                    <InsertDriveFileIcon sx={{
                        fontSize: 56,
                        color: isActive ? 'primary.main' : 'grey.400',
                        mb: 1,
                    }} />

                    <Tooltip title={agreement.agreement_name}>
                        <Typography variant="h6" noWrap fontWeight={600}>
                            {agreement.agreement_name}
                        </Typography>
                    </Tooltip>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Stage only — no Status chip per requirement */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Stage</Typography>
                        <Chip
                            label={formatStage(agreement.current_stage)}
                            size="small"
                            color={isActive ? 'primary' : 'default'}
                            variant={isActive ? 'filled' : 'outlined'}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Revision</Typography>
                        <Typography variant="body2" fontWeight={600}>
                            Rev {agreement.revision_number}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Owner</Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {agreement.owner}
                        </Typography>
                    </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
                    {isActive ? (
                        /* Active owner → full editor with action buttons */
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={onOpenAct}
                            sx={{ fontWeight: 700, px: 3 }}
                        >
                            Open &amp; Act
                        </Button>
                    ) : (
                        /* Not active owner → view-only (clicking card also works) */
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={onView}
                            sx={{ color: 'text.secondary', borderColor: 'divider' }}
                        >
                            View
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Grid>
    );
}

export default Dashboard;