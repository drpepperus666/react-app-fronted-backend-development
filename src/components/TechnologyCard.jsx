// components/TechnologyCard.jsx
import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

// Иконки статусов
import completedIcon from '../assets/completed.png';
import inProgressIcon from '../assets/in-progress.png';
import notStartedIcon from '../assets/not-started.png';

// Маппинг категорий для красивого отображения
const CATEGORY_LABELS = {
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Mobile',
    devops: 'DevOps',
    other: 'Другое'
};

function TechnologyCard({
    techId,
    title,
    description,
    status,
    category,
    startDate,
    deadline,
    resources,
    notes,
    onStatusChange,
    onNotesChange
}) {
// Статус
    let statusClass = '';
    let statusText = '';
    let statusIcon = '';

    if (status === 'completed') {
        statusClass = 'status-completed';
        statusText = 'Изучено';
        statusIcon = completedIcon;
    } else if (status === 'in-progress') {
        statusClass = 'status-in-progress';
        statusText = 'В процессе';
        statusIcon = inProgressIcon;
    } else {
        statusClass = 'status-not-started';
        statusText = 'Не начато';
        statusIcon = notStartedIcon;
    }

    // Форматирование даты
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div
            className={`technology-card ${statusClass}`}
            onClick={onStatusChange}
            role="button"
            tabIndex="0"
            aria-label={`Технология: ${title}. Категория: ${CATEGORY_LABELS[category] || category}. Статус: ${statusText}. Нажмите для изменения статуса.`}
        >
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description || 'Без описания'}</p>

            {/* Категория */}
            <div className="card-category">
                <span className="category-label">Категория:</span>
                <span className="category-value">{CATEGORY_LABELS[category] || category}</span>
            </div>

            {/* Сроки */}
            <div className="card-dates">
                <div className="date-item">
                    <span className="date-label">Начало:</span>
                    <span className="date-value">{formatDate(startDate)}</span>
                </div>
                <div className="date-item">
                    <span className="date-label">Дедлайн:</span>
                    <span className="date-value">{formatDate(deadline)}</span>
                </div>
            </div>

            {/* Ресурсы (если есть) */}
            {resources && (
                <div className="card-resources">
                    <span className="resources-label">Ресурсы:</span>
                    <p className="resources-value">{resources}</p>
                </div>
            )}

            {/* Статус с иконкой */}
            <div className="card-status">
                <img src={statusIcon} alt={statusText} className="status-icon" />
                <span className="status-text">{statusText}</span>
            </div>

            {/* Заметки */}
            <div className="notes-wrapper">
                <TechnologyNotes
                    notes={notes || ''}
                    onNotesChange={onNotesChange}
                    techId={techId}
                />
            </div>
        </div>
    );
}

export default TechnologyCard;