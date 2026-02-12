import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import ExamInfo from './pages/ExamInfo'
import TeamInfo from './pages/TeamInfo'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/exam-info" element={<ExamInfo />} />
                <Route path="/team-info" element={<TeamInfo />} />
            </Routes>
        </Router>
    )
}

export default App
