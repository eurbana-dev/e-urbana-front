import React from 'react';
import Resumen from '../../components/dashboard/resumen'; 
import GraficaConsumo from '../../components/dashboard/GraficaConsumo';
import Graficas from '../../components/dashboard/graficas';
import Analisis from '../../components/luminarias/analisis';
const Dashboard = ({ children }) => {
    return (
        <div className="dashboard-container">
            <Graficas />
            <Analisis />
            {children}
        </div>
    );
};

export default Dashboard;