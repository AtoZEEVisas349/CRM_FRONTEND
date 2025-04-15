import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/theme.css'; // ✅ Theme CSS here
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { ExecutiveActivityProvider } from './context/ExecutiveActivityContext'; // ✅ import your new context

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ApiProvider>
        <ExecutiveActivityProvider> {/* ✅ wrap App with ExecutiveActivityProvider */}
          <App />
        </ExecutiveActivityProvider>
      </ApiProvider>
    </AuthProvider>
  </BrowserRouter>
);
