import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../App.css';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { getStoredUser } from '../api/authHelpers';
import {
    Box, Button, Typography, AppBar, Toolbar, Grid,
    Alert, Paper, Divider, Chip
} from '@mui/material';
import {
    DocumentEditorContainerComponent,
    Toolbar as SyncfusionToolbar,
    Inject,
} from '@syncfusion/ej2-react-documenteditor';
import { registerLicense } from '@syncfusion/ej2-base';
import AuditTimeline from '../components/AuditTimeline';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JHaF1cXmhPYVFxWmFZfVhgdVVMZVRbQX9PIiBoS35RcEVlW39ccnFdQ2lYUkNzVEFe');

// BUG-06 FIX: Replace ALL underscores
const formatStage = (stage) => stage ? stage.replace(/_/g, ' ') : '';

function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const [agreement, setAgreement] = useState(null);
    const [auditRefreshKey, setAuditRefreshKey] = useState(0);

    // -----------------------------------------------------------------------
    // Store user in a ref so its reference NEVER changes between renders.
    // Previously: getStoredUser() was called every render → new object every
    // time → applyEditorSettings useCallback recreated → fetchAgreementData
    // useCallback recreated → useEffect re-fired → documentEditor.open()
    // called again → UNDID every unsaved edit the user just typed.
    // -----------------------------------------------------------------------
    const userRef = useRef(getStoredUser());
    const user = userRef.current;

    // -----------------------------------------------------------------------
    // Apply editor permissions — deps array is empty because user is a stable
    // ref value and editorRef is a ref. This function is created once only.
    // -----------------------------------------------------------------------
    const applyEditorSettings = useCallback((data) => {
        if (!editorRef.current) return;
        const editor = editorRef.current.documentEditor;
        if (!editor) return;

        editor.currentUser = user?.username ?? 'User';

        if (data.is_active) {
            switch (user?.role) {
                case 'JUNIOR':
                    editor.isReadOnly = false;
                    editor.enableTrackChanges = false;
                    editor.enableComment = true;
                    try { editor.showRevisions = true; } catch (_) { }
                    break;

                case 'SENIOR':
                    editor.isReadOnly = false;
                    editor.enableTrackChanges = false;
                    editor.enableComment = true;
                    try { editor.showRevisions = true; } catch (_) { }
                    break;

                case 'CLIENT':
                    editor.isReadOnly = false;
                    editor.enableTrackChanges = true;
                    editor.enableComment = true;
                    try { editor.showRevisions = true; } catch (_) { }
                    break;

                case 'MANAGER':
                case 'FOUNDER':
                default:
                    editor.isReadOnly = true;
                    editor.enableTrackChanges = false;
                    editor.enableComment = false;
                    try { editor.showRevisions = false; } catch (_) { }
                    break;
            }
        } else {
            editor.isReadOnly = true;
            editor.enableTrackChanges = false;
            editor.enableComment = false;
            try { editor.showRevisions = false; } catch (_) { }
        }
    }, []); // stable — no changing deps

    // -----------------------------------------------------------------------
    // Fetch ONLY sets state. Does NOT touch the editor directly.
    // This keeps fetchAgreementData stable (only recreates if id/navigate
    // change, i.e. navigating to a different agreement).
    // -----------------------------------------------------------------------
    const fetchAgreementData = useCallback(async () => {
        try {
            const response = await api.get(`/agreements/${id}/`);
            setAgreement(response.data);
        } catch (err) {
            console.error('Failed to load document', err);
            navigate('/dashboard');
        }
    }, [id, navigate]);

    // Initial fetch on mount / when id changes
    useEffect(() => {
        fetchAgreementData();
    }, [fetchAgreementData]);

    // -----------------------------------------------------------------------
    // Open the document and apply settings AFTER React has committed the
    // render. At this point the Syncfusion editor is guaranteed to be mounted
    // and editorRef.current is populated.
    //
    // This effect only fires when `agreement` state changes — which only
    // happens on initial load (not on every keystroke), so the document is
    // never reloaded while the user is typing.
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!agreement) return;
        if (!editorRef.current) return;

        const editor = editorRef.current.documentEditor;
        if (!editor) return;

        if (
            agreement.sfdt_content &&
            Object.keys(agreement.sfdt_content).length > 0
        ) {
            editor.open(JSON.stringify(agreement.sfdt_content));
        }

        applyEditorSettings(agreement);
    }, [agreement, applyEditorSettings]);

    // -----------------------------------------------------------------------
    // Save — only for editable roles (JUNIOR, SENIOR, CLIENT)
    // -----------------------------------------------------------------------
    const handleSave = async () => {
        if (!editorRef.current || !agreement?.is_active) return;
        // BUG-07 FIX: MANAGER and FOUNDER must not trigger a save
        if (user.role === 'MANAGER' || user.role === 'FOUNDER') return;

        const serializedData = editorRef.current.documentEditor.serialize();
        try {
            await api.put(`/agreements/${id}/save/`, {
                sfdt_content: JSON.parse(serializedData),
            });
            alert('Document Saved Successfully!');
            // BUG-24 FIX: Increment key to force AuditTimeline to re-fetch
            setAuditRefreshKey((k) => k + 1);
        } catch (err) {
            console.error('Save failed', err);
            alert('Save failed. Please try again.');
        }
    };

    // -----------------------------------------------------------------------
    // Generic workflow action (forward / accept)
    // -----------------------------------------------------------------------
    const handleWorkflowAction = async (endpoint, successMessage) => {
        // BUG-07 FIX: Only save if the user is an editable role
        if (user.role !== 'MANAGER' && user.role !== 'FOUNDER') {
            await handleSave();
        }
        try {
            await api.post(`/agreements/${id}/${endpoint}/`);
            alert(successMessage);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || 'Action failed. Please try again.';
            alert(`Error: ${msg}`);
            console.error('Workflow action failed', err);
        }
    };

    // -----------------------------------------------------------------------
    // Client: Request Changes — saves inline comments, bounces back to Junior
    // -----------------------------------------------------------------------
    const handleClientRequestChanges = async () => {
        if (editorRef.current) {
            const serializedData = editorRef.current.documentEditor.serialize();
            await api.put(`/agreements/${id}/save/`, {
                sfdt_content: JSON.parse(serializedData),
            });
        }
        try {
            await api.post(`/agreements/${id}/request-changes/`, {
                notes: 'Client has provided inline comments and tracked changes inside the document.',
            });
            alert('Changes requested! The file has been sent back to the Junior.');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to request changes.';
            alert(`Error: ${msg}`);
            console.error('Failed to request changes', err);
        }
    };

    if (!agreement || !user) return null;

    // --- Derived permission flags ---
    // Roles that can type in the document
    const canEdit =
        agreement.is_active &&
        (user.role === 'JUNIOR' || user.role === 'SENIOR' || user.role === 'CLIENT');

    // Syncfusion ribbon only for editable roles
    const showSyncfusionToolbar = canEdit;

    // Manager and Founder are always read-only viewers regardless of is_active
    const isReadOnlyViewer =
        user.role === 'MANAGER' || user.role === 'FOUNDER';

    // =========================================================================
    // READ-ONLY LAYOUT — Manager & Founder
    // Clean split: full-height document view (no toolbar) | Audit Timeline
    // =========================================================================
    if (isReadOnlyViewer) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* ---- Slim info bar ---- */}
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar variant="dense">
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {agreement.agreement_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Rev {agreement.revision_number}
                                &nbsp;&bull;&nbsp;
                                Stage: <strong>{formatStage(agreement.current_stage)}</strong>
                                &nbsp;&bull;&nbsp;
                                <Chip
                                    label={formatStage(agreement.status)}
                                    size="small"
                                    color={
                                        agreement.status === 'CHANGES_REQUESTED' ? 'error'
                                            : agreement.status === 'COMPLETED' ? 'success'
                                                : 'default'
                                    }
                                    sx={{ height: 16, fontSize: '0.6rem' }}
                                />
                            </Typography>
                        </Box>

                        {/* Approve & Forward — the only action for these roles */}
                        {agreement.is_active && (
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() =>
                                    handleWorkflowAction(
                                        'forward',
                                        `Approved and forwarded to ${user.role === 'MANAGER' ? 'Founder' : 'Client'
                                        }!`
                                    )
                                }
                            >
                                Approve &amp; Forward to{' '}
                                {user.role === 'MANAGER' ? 'Founder' : 'Client'}
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>

                {/* ---- Two-panel body ---- */}
                <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                    {/* Left — clean document viewer, no toolbar, no cursor */}
                    <Box
                        sx={{
                            flex: '0 0 72%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            borderRight: '1px solid #e0e0e0',
                            // Hide text cursor — this is a read-only review, not an editor
                            '& .e-de-cnt, & .e-documenteditor': {
                                caretColor: 'transparent !important',
                                cursor: 'default !important',
                            },
                            '& *': { cursor: 'default !important' },
                        }}
                    >
                        <DocumentEditorContainerComponent
                            id="documenteditor_container_readonly"
                            ref={editorRef}
                            height="100%"
                            width="100%"
                            style={{ display: 'block', height: '100%' }}
                            enableToolbar={false}
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
                        <AuditTimeline agreementId={id} refreshKey={auditRefreshKey} />
                    </Box>
                </Box>
            </Box>
        );
    }

    // =========================================================================
    // EDITABLE LAYOUT — Junior, Senior, Client
    // Full Syncfusion toolbar + Save + Workflow action buttons
    // =========================================================================
    return (
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* ---- Top Navigation Bar ---- */}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                            {agreement.agreement_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Revision {agreement.revision_number} &bull;&nbsp;
                            Stage: <strong>{formatStage(agreement.current_stage)}</strong>
                            &nbsp;&bull;&nbsp;
                            <Chip
                                label={formatStage(agreement.status)}
                                size="small"
                                color={agreement.status === 'CHANGES_REQUESTED' ? 'error'
                                    : agreement.status === 'COMPLETED' ? 'success' : 'default'}
                                sx={{ height: 18, fontSize: '0.65rem' }}
                            />
                        </Typography>
                    </Box>

                    {/* ---- Role-based action buttons (only for active owner) ---- */}
                    {agreement.is_active && (
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {/*
                             * Save button — visible for ALL editable roles: JUNIOR, SENIOR, CLIENT.
                             * MANAGER and FOUNDER have no Save button (they cannot edit).
                             */}
                            {canEdit && (
                                <Button variant="outlined" onClick={handleSave}>
                                    Save
                                </Button>
                            )}

                            {/* Forward — JUNIOR → Senior, SENIOR → Manager */}
                            {(user.role === 'JUNIOR' || user.role === 'SENIOR') && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        handleWorkflowAction(
                                            'forward',
                                            `Forwarded to ${user.role === 'JUNIOR' ? 'Senior' : 'Manager'}!`
                                        )
                                    }
                                >
                                    Forward to {user.role === 'JUNIOR' ? 'Senior' : 'Manager'}
                                </Button>
                            )}

                            {/* CLIENT actions */}
                            {user.role === 'CLIENT' && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleClientRequestChanges}
                                    >
                                        Request Changes
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() =>
                                            handleWorkflowAction('accept', 'Agreement Accepted! Workflow complete.')
                                        }
                                    >
                                        Accept Agreement
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* ---- Main Content: Editor + Right Drawer ---- */}
            <Grid container sx={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
                {/* Document Editor */}
                <Grid item xs={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                    {/* Revision Brief Panel — visible when CHANGES_REQUESTED */}
                    {agreement.status === 'CHANGES_REQUESTED' && agreement.revision_notes && (
                        <Paper
                            elevation={0}
                            sx={{
                                m: 1.5,
                                p: 2,
                                bgcolor: '#fff8e1',
                                border: '1px solid #ffcc80',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="subtitle2" color="warning.dark" fontWeight={700} gutterBottom>
                                📋 Revision Brief — Client Requested Changes
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {agreement.revision_notes}
                            </Typography>
                        </Paper>
                    )}

                    <div
                        className="App"
                        style={{ flex: 1, height: '100%', width: '100%', overflow: 'hidden' }}
                    >
                        <DocumentEditorContainerComponent
                            id="documenteditor_container"
                            ref={editorRef}
                            height="100%"
                            width="100%"
                            style={{ display: 'block' }}
                            enableToolbar={showSyncfusionToolbar}
                        >
                            <Inject services={[SyncfusionToolbar]} />
                        </DocumentEditorContainerComponent>
                    </div>
                </Grid>

                {/* Audit Timeline (right drawer) */}
                <Grid
                    item
                    xs={4}
                    sx={{
                        height: '100%',
                        borderLeft: '1px solid #e0e0e0',
                        bgcolor: '#fafafa',
                        overflowY: 'auto',
                    }}
                >
                    {/* refreshKey triggers AuditTimeline re-fetch after save */}
                    <AuditTimeline agreementId={id} refreshKey={auditRefreshKey} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Editor;