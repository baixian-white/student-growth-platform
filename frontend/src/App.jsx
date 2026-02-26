import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import ExamInfo from './pages/ExamInfo'
import ExamAnalysis from './pages/ExamAnalysis'
import StrongBasePlan from './pages/StrongBasePlan'
import TechSpecialty from './pages/TechSpecialty'
import TeamInfo from './pages/TeamInfo'
import WhitelistCompetitions from './pages/WhitelistCompetitions'
import CompetitionDetail from './pages/CompetitionDetail'
import InformaticsOlympiad from './pages/InformaticsOlympiad'
import InformaticsArticle from './pages/InformaticsArticle'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/exam-info" element={<ExamInfo />} />
                <Route path="/exam-analysis" element={<ExamAnalysis />} />
                <Route path="/strong-base" element={<StrongBasePlan />} />
                <Route path="/tech-specialty" element={<TechSpecialty />} />
                <Route path="/team-info" element={<TeamInfo />} />
                <Route path="/whitelist-competitions" element={<WhitelistCompetitions />} />
                <Route path="/competition/:id" element={<CompetitionDetail />} />
                <Route path="/informatics-olympiad" element={<InformaticsOlympiad />} />
                <Route path="/informatics-article/:type/:id" element={<InformaticsArticle />} />
            </Routes>
        </Router>
    )
}

export default App
