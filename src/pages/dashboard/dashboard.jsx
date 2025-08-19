import React from 'react';
import Resumen from '../../components/dashboard/resumen'; 
import GraficaConsumo from '../../components/dashboard/GraficaConsumo';
const Dashboard = ({ children }) => {
    return (
        <div className="dashboard-container">
            <Resumen />
            <GraficaConsumo />
            {children}
        </div>
    );
};

export default Dashboard;