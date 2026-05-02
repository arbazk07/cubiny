// src/App.jsx — Cubiny v6
import { Component } from 'react';
import { useAuth }   from './hooks/useAuth';
import { AppShell }  from './components/layout/AppShell';
import { AuthPage }  from './pages/Auth/AuthPage';

class ErrorBoundary extends Component {
  state = { hasError:false, error:null };
  static getDerivedStateFromError(error) { return { hasError:true, error }; }
  componentDidCatch(err, info) { console.error('[Cubiny ErrorBoundary]', err, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:16, background:'var(--bg)', color:'var(--text-primary)' }}>
        <div style={{ width:56, height:56, borderRadius:'var(--r-xl)', background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>⚠️</div>
        <h2 style={{ fontSize:20, fontWeight:800 }}>Something went wrong</h2>
        <p style={{ fontSize:13, color:'var(--text-muted)', maxWidth:360, textAlign:'center' }}>{this.state.error?.message ?? 'An unexpected error occurred.'}</p>
        <button onClick={() => this.setState({ hasError:false, error:null })} style={{
          padding:'10px 24px', borderRadius:'var(--r-lg)',
          background:'#22C55E', color:'white', border:'none',
          fontFamily:'var(--font)', fontSize:14, fontWeight:600, cursor:'pointer',
          boxShadow:'0 4px 14px rgba(34,197,94,0.35)',
        }}>Try Again</button>
      </div>
    );
  }
}

function Router() {
  const { user } = useAuth();
  return user ? <AppShell/> : <AuthPage/>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router/>
    </ErrorBoundary>
  );
}
