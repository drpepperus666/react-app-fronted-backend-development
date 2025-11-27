// pages/TechnologyList.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyCard from '../components/TechnologyCard';

function TechnologyList() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTechnologies(parsed);
            } catch (e) {
                console.error('Ошибка при загрузке технологий из localStorage:', e);
                setTechnologies([]);
            }
        }
        setLoading(false);
    }, []);

    const handleNotesChange = (id, newNotes) => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            try {
                const technologies = JSON.parse(saved);
                const updated = technologies.map(t =>
                    t.id === id ? { ...t, notes: newNotes } : t
                );
                localStorage.setItem('technologies', JSON.stringify(updated));
                setTechnologies(updated);
            } catch (e) {
                console.error('Ошибка при обновлении заметок:', e);
            }
        }
    };

    if (loading) {
        return (
            <div className="page">
                <h1>Загрузка технологий...</h1>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            {technologies.length > 0 ? (
                <div className="technologies-list">
                    {technologies.map(tech => (
                        <TechnologyCard
                            key={tech.id}
                            techId={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                            category={tech.category || 'frontend'}
                            startDate={tech.startDate || ''}
                            deadline={tech.deadline || ''}
                            resources={tech.resources || ''}
                            notes={tech.notes || ''}
                            onStatusChange={() => {}} // Заглушка — управление статусом на детальной странице
                            onNotesChange={handleNotesChange}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>Технологий пока нет.</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        Добавить первую технологию
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TechnologyList;