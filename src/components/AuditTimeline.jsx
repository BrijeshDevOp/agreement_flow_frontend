import React, { useState, useEffect } from 'react';
import {
    Box, Typography, List, ListItem, ListItemText,
    Divider, Paper, Chip, CircularProgress
} from '@mui/material';
import api from '../api/axiosConfig';

// BUG-06 FIX: Replace all underscores in stage names
const formatStage = (stage) => stage ? stage.replace(/_/g, ' ') : '';

/**
 * BUG-05 FIX:
 *  - Accepts a `refreshKey` prop so the parent (Editor) can force a re-fetch
 *    after a save action without changing the agreementId.
 *  - API now returns `id` and `pipeline_stage`, so the React key is valid
 *    and the stage label renders correctly.
 * BUG-17 FIX: Logs are now returned oldest-first (changed in views.py).
 */
function AuditTimeline({ agreementId, refreshKey }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (agreementId) {
            fetchLogs();
        }
    }, [agreementId, refreshKey]); // re-fetch when refreshKey changes

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/agreements/${agreementId}/audit-log/`);
            setLogs(response.data);
        } catch (err) {
            console.error('Failed to fetch audit logs', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ height: '100%', overflowY: 'auto', p: 2, bgcolor: 'transparent' }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight={700}>
                Audit Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <List disablePadding>
                    {logs.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No history available.
                        </Typography>
                    ) : (
                        logs.map((log) => (
                            // BUG-05 FIX: log.id is now returned by the API so this key is valid
                            <React.Fragment key={log.id}>
                                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={700}>
                                                {log.action}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {log.user_name}{' '}
                                                    <Chip
                                                        label={log.role}
                                                        size="small"
                                                        sx={{ height: 16, fontSize: '0.6rem', ml: 0.5 }}
                                                    />
                                                </Typography>
                                                <br />
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </Typography>
                                                <br />
                                                {/* BUG-05 FIX: pipeline_stage now included in API response */}
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Stage: {formatStage(log.pipeline_stage)}
                                                </Typography>
                                                {log.remarks && (
                                                    <>
                                                        <br />
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            color="warning.dark"
                                                        >
                                                            Note: {log.remarks}
                                                        </Typography>
                                                    </>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>
            )}
        </Paper>
    );
}

export default AuditTimeline;