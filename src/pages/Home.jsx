import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Container, Typography, Paper, Grid, Divider
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import GroupsIcon from '@mui/icons-material/Groups';

const features = [
    {
        icon: <GavelIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
        title: 'End-to-End Lifecycle',
        desc: 'Manage contracts from initial draft to final client approval without leaving the platform.',
    },
    {
        icon: <VerifiedUserIcon sx={{ fontSize: 36, color: 'success.main' }} />,
        title: 'Role-Based Access',
        desc: 'Junior → Senior → Manager → Founder → Client. Strict workflow — no stage can be skipped.',
    },
    {
        icon: <TrackChangesIcon sx={{ fontSize: 36, color: 'warning.main' }} />,
        title: 'Immutable Audit Trail',
        desc: 'Every action is permanently logged with user, role, timestamp, and pipeline stage.',
    },
    {
        icon: <GroupsIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
        title: 'Client Collaboration',
        desc: 'Clients can add inline comments, request changes, or accept agreements directly.',
    },
];

function Home() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 50%, #0288d1 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
            }}
        >
            <Container maxWidth="md">
                {/* Hero */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%',
                        p: 2.5, mb: 3,
                    }}>
                        <GavelIcon sx={{ fontSize: 52, color: 'white' }} />
                    </Box>

                    <Typography
                        variant="h2"
                        fontWeight={800}
                        color="white"
                        gutterBottom
                        sx={{ letterSpacing: '-1px' }}
                    >
                        AgreementFlow
                    </Typography>

                    <Typography
                        variant="h6"
                        color="rgba(255,255,255,0.8)"
                        sx={{ maxWidth: 560, mx: 'auto', mb: 4, lineHeight: 1.7 }}
                    >
                        Internal contract lifecycle management — from first draft to final acceptance,
                        with full audit visibility at every step.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.dark',
                            fontWeight: 700,
                            px: 5,
                            py: 1.5,
                            fontSize: '1rem',
                            borderRadius: 3,
                            '&:hover': { bgcolor: '#e3f2fd' },
                        }}
                    >
                        Sign In
                    </Button>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 5 }} />

                {/* Feature Cards */}
                <Grid container spacing={3}>
                    {features.map((f) => (
                        <Grid item xs={12} sm={6} key={f.title}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    height: '100%',
                                }}
                            >
                                <Box sx={{ mb: 1.5 }}>{f.icon}</Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom color="white">
                                    {f.title}
                                </Typography>
                                <Typography variant="body2" color="rgba(255,255,255,0.75)">
                                    {f.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Home;
