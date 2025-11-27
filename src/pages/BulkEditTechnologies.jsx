// pages/BulkEditTechnologies.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../useTechnologies';
import './BulkEditTechnologies.css';

const STATUSES = [
    { value: 'not-started', label: 'Не начато' },
    { value: 'in-progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершено' }
];

function BulkEditTechnologies() {
    const { technologies, updateMultipleStatuses } = useTechnologies();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [newStatus, setNewStatus] = useState('not-started');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' или 'error'

    // Обработчик выбора/снятия технологии
    const toggleSelection = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Выделить все / снять все
    const toggleSelectAll = () => {
        if (selectedIds.size === technologies.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(technologies.map(t => t.id)));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedIds.size === 0) {
            setMessage('Пожалуйста, выберите хотя бы одну технологию.');
            setMessageType('error');
            return;
        }

        const ids = Array.from(selectedIds);
        updateMultipleStatuses(ids, newStatus);

        setMessage(`Статус "${STATUSES.find(s => s.value === newStatus)?.label}" успешно применён к ${ids.length} технологиям.`);
        setMessageType('success');
        setSelectedIds(new Set()); // Опционально: сбросить выбор после применения
    };

    const handleClearSelection = () => {
        setSelectedIds(new Set());
        setMessage('');
    };

    // Очистка сообщения при изменении выбора или статуса
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="page bulk-edit-page">
            <div className="page-header">
                <h1>Массовое редактирование статусов</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                    aria-label="Вернуться назад"
                >
                    ← Назад
                </button>
            </div>

            {technologies.length === 0 ? (
                <div className="empty-state">
                    <p>Нет технологий для редактирования.</p>
                    <button
                        onClick={() => navigate('/add-technology')}
                        className="btn btn-primary"
                    >
                        Добавить технологию
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bulk-edit-form" noValidate>
                    {/* Таблица технологий */}
                    <div className="technologies-table">
                        <div className="table-header">
                            <div className="checkbox-cell">
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={selectedIds.size === technologies.length && technologies.length > 0}
                                    onChange={toggleSelectAll}
                                    aria-label="Выбрать все технологии"
                                />
                                <label htmlFor="select-all">Выбрать все</label>
                            </div>
                            <div className="title-cell">Технология</div>
                            <div className="status-cell">Текущий статус</div>
                        </div>

                        <div className="table-body">
                            {technologies.map(tech => (
                                <div key={tech.id} className="table-row">
                                    <div className="checkbox-cell">
                                        <input
                                            type="checkbox"
                                            id={`tech-${tech.id}`}
                                            checked={selectedIds.has(tech.id)}
                                            onChange={() => toggleSelection(tech.id)}
                                            aria-labelledby={`tech-title-${tech.id}`}
                                        />
                                    </div>
                                    <div id={`tech-title-${tech.id}`} className="title-cell">
                                        {tech.title}
                                    </div>
                                    <div className="status-cell">
                                        {STATUSES.find(s => s.value === tech.status)?.label || tech.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Выбор нового статуса */}
                    <div className="form-group">
                        <label htmlFor="new-status">Новый статус для выбранных технологий</label>
                        <select
                            id="new-status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            aria-describedby="status-hint"
                        >
                            {STATUSES.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <p id="status-hint" className="hint">
                            Выбранный статус будет применён ко всем отмеченным технологиям.
                        </p>
                    </div>

                    {/* Кнопки */}
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={selectedIds.size === 0}>
                            Применить статус
                        </button>
                        <button
                            type="button"
                            onClick={handleClearSelection}
                            className="btn btn-outline"
                            disabled={selectedIds.size === 0}
                        >
                            Снять выделение
                        </button>
                    </div>

                    {/* Сообщение об ошибке или успехе */}
                    {message && (
                        <div
                            className={`message ${messageType}`}
                            role={messageType === 'error' ? 'alert' : 'status'}
                            aria-live={messageType === 'error' ? 'assertive' : 'polite'}
                        >
                            {message}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}

export default BulkEditTechnologies;