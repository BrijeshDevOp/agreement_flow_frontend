import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { hasValidToken } from './api/authHelpers';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ViewOnly from './pages/ViewOnly';

// Guard: redirect to / if no valid token stored
const PrivateRoute = ({ children }) => {
    return hasValidToken() ? children : <Navigate to="/" replace />;
};

// If already logged in, skip the Home/Login pages
const PublicRoute = ({ children }) => {
    return hasValidToken() ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* BUG-21 FIX: Home page at root, Login at /login */}
                <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/editor/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />
                <Route path="/view/:id" element={<PrivateRoute><ViewOnly /></PrivateRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;