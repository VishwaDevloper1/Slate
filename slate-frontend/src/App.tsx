import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/auth/login";
import Signupe from './pages/auth/signup';
import Merger from './pages/merge';
import Forgot from './pages/auth/forgot';
import ResetPassword from './pages/auth/reset';
import MergeSuccess from './pages/merge_success';
import Split from './pages/split';
import Compress from './pages/Compress';
import Convert from './pages/Convert';
import Home from './pages/home';
// Temporary quick pages taaki links par click karne par screen blank na ho
function App() {
  return (
  <>
      {/* Root Layout Viewport Wrapper Container */}
      <div className="h-screen w-screen bg-brand-600 bg-slate-50 text-slate-900 flex flex-col overflow-hidden">
        
        {/* Persistent Shared Header Area */}

        {/* Dynamic Inner Page Workspace Switcher Frame Section */}
        <main className="flex-1 overflow-auto relative">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/merge" element={<Merger />} />
            <Route path="/split" element={<Split />} />
            <Route path="/compress" element={<Compress />} />
            <Route path="/Convert" element={<Convert />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signupe />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset" element={<ResetPassword/>} />
            <Route path="/merge-success" element={<MergeSuccess/>} />
          </Routes>
        </main>
        
      </div>
      </>
  );
}

export default App;