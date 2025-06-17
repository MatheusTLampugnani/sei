import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api';

const Home = () => {
    const [counts, setCounts] = useState({
        alunos: 0, professores: 0, disciplinas: 0, locais: 0, turmas: 0,
    });
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [alunosRes, profRes, discRes, locaisRes, turmasRes] = await Promise.all([
                    api.get('/alunos/count/total'),
                    api.get('/professores/count/total'),
                    api.get('/disciplinas/count/total'),
                    api.get('/locais/count/total'),
                    api.get('/turmas/count/total')
                ]);
                setCounts({
                    alunos: alunosRes.data.total,
                    professores: profRes.data.total,
                    disciplinas: discRes.data.total,
                    locais: locaisRes.data.total,
                    turmas: turmasRes.data.total,
                });
            } catch (error) {
                console.error("Erro ao buscar contagens:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    return (
        <div className="container mt-5">
            <div className="p-5 mb-4 bg-dark text-white rounded-3 shadow-sm">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Sistema Educacional Integrado</h1>
                    <p className="col-md-8 fs-4">Bem-vindo ao painel de controle. Gerencie alunos, professores, turmas e muito mais de forma centralizada.</p>
                </div>
            </div>
            <div className="row justify-content-center g-4 mb-5">
                {loading ? <div className="text-center"><p>Carregando estatísticas...</p></div> : (
                    <>
                        <DashboardCard title="Alunos" count={counts.alunos} link="/alunos" icon="bi-people-fill"/>
                        <DashboardCard title="Professores" count={counts.professores} link="/professores" icon="bi-person-video3"/>
                        <DashboardCard title="Disciplinas" count={counts.disciplinas} link="/disciplinas" icon="bi-book-half"/>
                        <DashboardCard title="Locais" count={counts.locais} link="/locais" icon="bi-geo-alt-fill"/>
                        <DashboardCard title="Turmas" count={counts.turmas} link="/turmas" icon="bi-collection-fill"/>
                    </>
                )}
            </div>
            <div className="row justify-content-center mt-4">
                <div className="col-lg-8 col-md-10">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0"><i className="bi bi-calendar-event me-2"></i>Calendário Acadêmico</h5>
                        </div>
                        <div className="card-body d-flex justify-content-center">
                             <Calendar
                                onChange={setDate}
                                value={date}
                                className="border-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, count, link, icon }) => (
    <div className="col-md-4 col-lg-2">
        <div className="card h-100 shadow-sm text-center card-hover">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className={`bi ${icon} fs-1 mb-2 text-primary`}></i>
                <h5 className="card-title">{title}</h5>
                <p className="card-text display-6 fw-bold">{count}</p>
                <Link to={link} className="btn btn-outline-primary mt-auto stretched-link">
                    Gerenciar
                </Link>
            </div>
        </div>
    </div>
);

export default Home;