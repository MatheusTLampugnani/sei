import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ReativarProfessor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const reativarProfessor = async () => {
      if (window.confirm('Tem certeza que deseja reativar este professor?')) {
        try {
          await api.patch(`/professores/${id}/reativar`);
          navigate('/professores');
        } catch (error) {
          console.error('Erro ao reativar professor:', error);
        }
      } else {
        navigate('/professores');
      }
    };

    reativarProfessor();
  }, [id, navigate]);

  return <div className="container">Reativando professor...</div>;
};

export default ReativarProfessor;