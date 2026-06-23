import React, { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { getStoredUser } from '../api/authHelpers';
import { Box, Typography, AppBar, Toolbar, Chip, IconButton, Tooltip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    DocumentEditorContainerComponent,
    Toolbar as SyncfusionToolbar,
    Inject,
} from '@syncfusion/ej2-react-documenteditor';
import { registerLicense } from '@syncfusion/ej2-base';
import AuditTimeline from '../components/AuditTimeline';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JHaF1cXmhPYVFxWmFZfVhgdVVMZVRbQX9PIiBoS35RcEVlW39ccnFdQ2lYUkNzVEFe');

const formatStage = (stage) => stage ? stage.replace(/_/g, ' ') : '';


function ViewOnly() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const user = getStoredUser();

    const [agreement, setAgreement] = React.useState(null);

    const loadDocument = useCallback(async () => {
        try {
            const { data } = await api.get(`/agreements/${id}/`);
            setAgreement(data);

            if (
                editorRef.current &&
                data.sfdt_content &&
                Object.keys(data.sfdt_content).length > 0
            ) {
                editorRef.current.documentEditor.open(JSON.stringify(data.sfdt_content));
            }

            if (editorRef.current) {
                const editor = editorRef.current.documentEditor;
                // Fully read-only — no editing, no track-change creation
                editor.isReadOnly = true;
                editor.enableTrackChanges = false;
                editor.enableComment = false;
                try { editor.showRevisions = false; } catch (_) {}
            }
        } catch (err) {
            console.error('Failed to load document for viewing', err);
            navigate('/dashboard');
        }
    }, [id, navigate]);

    const handleDownload = () => {
        if (editorRef.current) {
            const editor = editorRef.current.documentEditor;
            if (editor) {
                editor.save(agreement?.agreement_name || 'Agreement', 'Docx');
            }
        }
    };

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        loadDocument();
    }, [loadDocument]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!agreement) return null;

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* ── Slim info bar — only download button when completed ── */}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar variant="dense">
                    <Tooltip title="Back to Dashboard">
                        <IconButton
                            edge="start"
                            size="small"
                            sx={{ mr: 1.5 }}
                            onClick={() => navigate('/dashboard')}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>
                            {agreement.agreement_name}
                            <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 1.5 }}
                            >
                                Rev {agreement.revision_number}
                            </Typography>
                        </Typography>
                    </Box>

                    {agreement.current_stage === 'COMPLETED' ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleDownload}
                        >
                            Download DOCX
                        </Button>
                    ) : (
                        <>
                            {/* Stage only — no action buttons */}
                            <Chip
                                label={formatStage(agreement.current_stage)}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label="View Only"
                                size="small"
                                color="default"
                                sx={{ bgcolor: '#f5f5f5', fontSize: '0.65rem' }}
                            />
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* ── Two-panel body ── */}
            <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                {/* Left — document viewer */}
                <Box
                    sx={{
                        flex: '0 0 72%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRight: '1px solid #e0e0e0',
                        // Hide the text cursor so the document looks like a true preview
                        '& .e-de-cnt, & .e-documenteditor': {
                            caretColor: 'transparent !important',
                            cursor: 'default !important',
                        },
                        '& *': { cursor: 'default !important' },
                    }}
                >
                    <DocumentEditorContainerComponent
                        id="documenteditor_container_view"
                        ref={editorRef}
                        height="100%"
                        width="100%"
                        style={{ display: 'block', height: '100%' }}
                        enableToolbar={false}   // No ribbon at all
                    >
                        <Inject services={[SyncfusionToolbar]} />
                    </DocumentEditorContainerComponent>
                </Box>

                {/* Right — Audit Timeline */}
                <Box
                    sx={{
                        flex: '0 0 28%',
                        height: '100%',
                        overflowY: 'auto',
                        bgcolor: '#fafafa',
                    }}
                >
                    <AuditTimeline agreementId={id} refreshKey={0} />
                </Box>
            </Box>
        </Box>
    );
}

export default ViewOnly;
