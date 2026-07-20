import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import StatusSearch from './pages/StatusSearch'
import StatusResult from './pages/StatusResult'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import QuestionWidget from './components/QuestionWidget'

import PwaInstallPrompt from './components/PwaInstallPrompt'

function AppWithWidget() {
  const { pathname } = useLocation()
  const showWidget = pathname !== '/'

  return (
    <>
      <Routes>
        <Route path="/"                index element={<Welcome />} />
        <Route path="/accueil"         element={<Home />} />
        <Route path="/statut"          element={<StatusSearch />} />
        <Route path="/statut/resultat" element={<StatusResult />} />
        <Route path="/faq"             element={<FAQ />} />
        <Route path="/contact"         element={<Contact />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
      {showWidget && <QuestionWidget />}
      <PwaInstallPrompt />
    </>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <AppWithWidget />
      </BrowserRouter>
    </SessionProvider>
  )
}
