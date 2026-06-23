import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Container, Typography, Grid, Divider
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

/* ── Google Font import (Inter) ── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
if (!document.head.querySelector('link[href*="Inter"]')) {
    document.head.appendChild(fontLink);
}

const features = [
    {
        icon: <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />,
        title: 'End-to-End Lifecycle',
        desc: 'Manage contracts from initial draft to final client approval without leaving the platform.',
        accent: '#2563eb',
        bg: '#eff6ff',
    },
    {
        icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 28 }} />,
        title: 'Role-Based Access',
        desc: 'Junior → Senior → Manager → Founder → Client. Strict workflow — no stage can be skipped.',
        accent: '#16a34a',
        bg: '#f0fdf4',
    },
    {
        icon: <TrackChangesOutlinedIcon sx={{ fontSize: 28 }} />,
        title: 'Immutable Audit Trail',
        desc: 'Every action is permanently logged with user, role, timestamp, and pipeline stage.',
        accent: '#d97706',
        bg: '#fffbeb',
    },
    {
        icon: <GroupsOutlinedIcon sx={{ fontSize: 28 }} />,
        title: 'Client Collaboration',
        desc: 'Clients can add inline comments, request changes, or accept agreements directly.',
        accent: '#7c3aed',
        bg: '#f5f3ff',
    },
];

function Home() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',
                bgcolor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box',
            }}
        >
            {/* ── Top Nav Bar ── */}
            <Box
                sx={{
                    width: '100%',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #f0f0f0',
                    px: { xs: 3, md: 6 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#ffffff',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: '#111827',
                        letterSpacing: '-0.3px',
                    }}
                >
                    AgreementFlow
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/login')}
                    sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: '#2563eb',
                        borderColor: '#2563eb',
                        borderRadius: '8px',
                        px: 2.5,
                        py: 0.7,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#eff6ff',
                            borderColor: '#1d4ed8',
                        },
                    }}
                >
                    Sign In
                </Button>
            </Box>

            {/* ── Hero Section ── */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 3, md: 6 },
                    pt: { xs: 8, md: 10 },
                    pb: { xs: 6, md: 8 },
                }}
            >
                <Container maxWidth="md" disableGutters>
                    <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
                        {/* Badge */}
                        <Box
                            sx={{
                                display: 'inline-block',
                                bgcolor: '#eff6ff',
                                color: '#2563eb',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                px: 2,
                                py: 0.6,
                                borderRadius: '999px',
                                mb: 3,
                            }}
                        >
                            Contract Lifecycle Management
                        </Box>

                        {/* Title */}
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 800,
                                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                                lineHeight: 1.12,
                                letterSpacing: '-1.5px',
                                color: '#111827',
                                mb: 2.5,
                            }}
                        >
                            Agreement management,{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                simplified.
                            </Box>
                        </Typography>

                        {/* Subtitle */}
                        <Typography
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                color: '#6b7280',
                                maxWidth: 520,
                                mx: 'auto',
                                lineHeight: 1.75,
                                mb: 4.5,
                            }}
                        >
                            From first draft to final acceptance — with full audit visibility
                            and role-based controls at every step.
                        </Typography>

                        {/* CTA */}
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                bgcolor: '#2563eb',
                                color: '#ffffff',
                                px: 4,
                                py: 1.4,
                                borderRadius: '10px',
                                textTransform: 'none',
                                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                                '&:hover': {
                                    bgcolor: '#1d4ed8',
                                    boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
                                },
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>

                    {/* ── Divider ── */}
                    <Divider sx={{ borderColor: '#f3f4f6', mb: { xs: 6, md: 8 } }}>
                        <Typography
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.78rem',
                                fontWeight: 500,
                                color: '#9ca3af',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                px: 2,
                            }}
                        >
                            Platform Features
                        </Typography>
                    </Divider>

                    {/* ── Feature Grid ── */}
                    <Grid container spacing={3}>
                        {features.map((f) => (
                            <Grid item xs={12} sm={6} key={f.title}>
                                <Box
                                    sx={{
                                        p: 3.5,
                                        borderRadius: '14px',
                                        border: '1px solid #f0f0f0',
                                        bgcolor: '#ffffff',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {/* Icon badge */}
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                            bgcolor: f.bg,
                                            color: f.accent,
                                            mb: 0.5,
                                        }}
                                    >
                                        {f.icon}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            color: '#111827',
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {f.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 400,
                                            fontSize: '0.88rem',
                                            color: '#6b7280',
                                            lineHeight: 1.65,
                                        }}
                                    >
                                        {f.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── Footer ── */}
            <Box
                sx={{
                    borderTop: '1px solid #f0f0f0',
                    py: 2.5,
                    textAlign: 'center',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.8rem',
                        color: '#9ca3af',
                    }}
                >
                    © {new Date().getFullYear()} AgreementFlow. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default Home;
