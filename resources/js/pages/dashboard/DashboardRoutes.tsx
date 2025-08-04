import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import Alunos from './Alunos';
import Planos from './Planos';
import Vencimentos from './Vencimentos';
import Navbar from '../../components/Navbar';
import Professores from './Professores';
import Atividades from './Atividades';
import AlunoPerfil from './AlunoPerfil';



export default function DashboardRoutes() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <Navbar />
            {/* <div className="h-16"/> */}
            <div className="flex flex-1 flex-col w-full md:w-[70%] pt-20">
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="alunos" element={<Alunos />} />
                    <Route path="alunos/:id" element={<AlunoPerfil />} />
                    <Route path="professores" element={<Professores />} />
                    <Route path="atividades" element={<Atividades />} />
                    <Route path="planos" element={<Planos />} />
                    <Route path="vencimentos" element={<Vencimentos />} />
                </Routes>
            </div>
        </div>
    );
}
