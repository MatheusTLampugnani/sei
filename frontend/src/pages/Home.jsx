import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
    const [counts, setCounts] = useState({
        alunos: 0,
        professores: 0,
        disciplinas: 0,
        locais: 0,
        turmas: 0,
    });
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
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Bem-vindo ao SEI - Sistema Educacional Integrado!</h1>

            {loading ? <p>Carregando estatísticas...</p> : (
                <div className="row justify-content-center g-4">
                    <DashboardCard title="Alunos" count={counts.alunos} link="/alunos"/>
                    <DashboardCard title="Professores" count={counts.professores} link="/professores"/>
                    <DashboardCard title="Disciplinas" count={counts.disciplinas} link="/disciplinas"/>
                    <DashboardCard title="Locais" count={counts.locais} link="/locais"/>
                    <DashboardCard title="Turmas" count={counts.turmas} link="/turmas"/>
                </div>
            )}
        </div>
    );
};

const DashboardCard = ({ title, count, link, icon }) => (
    <div className="col-md-4 col-lg-2">
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <div className="fs-1 mb-2">{icon}</div>
                <h5 className="card-title">{title}</h5>
                <p className="card-text fs-3 fw-bold">{count}</p>
                <Link to={link} className="btn btn-outline-primary mt-auto">
                    Gerenciar
                </Link>
            </div>
        </div>
    </div>
);

export default Home;