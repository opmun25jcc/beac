import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Updates from './App.tsx';
import Editor from './Editor.tsx';
import CouncilDirectives from './councilDirectives.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes >
        <Route path="/" element={<Updates/>}/>
        <Route path="/editor" element={<Editor/>}/>
        <Route path="/council-directives" element={<CouncilDirectives/>}/>
      </Routes>
    </HashRouter>
  </StrictMode>,
)

// # example: ensure React 18 for createRoot
// npm install react@18 react-dom@18 react-router-dom@6

// # cleanup + reinstall
// rm -rf node_modules package-lock.json
// npm install

// # try to dedupe if needed
// npm dedupe