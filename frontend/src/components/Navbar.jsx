import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/vite.svg" alt="SEI Logo" width="30" height="24" className="d-inline-block align-text-top me-2" />
          SEI - Integrado
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/alunos">
                Alunos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/professores">
                Professores
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/disciplinas">
                Disciplinas
              </NavLink>
            </li>
             <li className="nav-item">
              <NavLink className="nav-link" to="/locais">
                Locais (Salas)
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/turmas">
                Turmas
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;