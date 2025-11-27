// pages/Settings.jsx
import { useState } from 'react';
import useTechnologies from '../useTechnologies';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const { exportData, importData } = useTechnologies();
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // ✅ ЭКСПОРТ: скачивает JSON-файл
    const handleExport = () => {
        try {
            const dataStr = exportData();
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = 'technologies-export.json';

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            setModalMessage('Ошибка при экспорте: ' + error.message);
            setIsModalOpen(true);
        }
    };

    // ✅ ИМПОРТ: обрабатывает выбор файла
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверка расширения
        if (!file.name.endsWith('.json')) {
            setModalMessage('Ошибка: файл должен иметь расширение .json');
            setIsModalOpen(true);
            e.target.value = ''; // сбросить input
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const count = importData(data);
                setModalMessage(`Успешно импортировано ${count} технологий.`);
                setIsModalOpen(true);
            } catch (error) {
                setModalMessage('Ошибка импорта: ' + (error.message || 'Некорректный файл'));
                setIsModalOpen(true);
            }
            e.target.value = ''; // сбросить input
        };

        reader.onerror = () => {
            setModalMessage('Ошибка чтения файла');
            setIsModalOpen(true);
            e.target.value = '';
        };

        reader.readAsText(file);
    };

    const handleSave = () => {
        alert('Настройки сохранены!');
    };

    const handleReset = () => {
        if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            localStorage.removeItem('settings');
            alert('Все данные сброшены. Приложение перезагрузится.');
            window.location.reload();
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки приложения</h1>
                <p>Управляйте параметрами трекера технологий</p>
            </div>

            <div className="settings-form">
                {/* ... существующие настройки ... */}
                <div className="setting-group">
                    <h3>Внешний вид</h3>
                    <div className="setting-item">
                        <label htmlFor="theme">Тема оформления:</label>
                        <select 
                            id="theme" 
                            value={theme} 
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="light">Светлая</option>
                            <option value="dark">Тёмная</option>
                        </select>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>Уведомления</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />
                            Включить уведомления о смене статуса
                        </label>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>Данные</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={autoSave}
                                onChange={(e) => setAutoSave(e.target.checked)}
                            />
                            Автосохранение заметок
                        </label>
                    </div>
                </div>

                {/* ✅ НОВЫЙ БЛОК: ЭКСПОРТ/ИМПОРТ */}
                {/* ✅ НОВЫЙ БЛОК: ЭКСПОРТ/ИМПОРТ */}
                <div className="setting-group">
                    <h3>Резервное копирование</h3>
                    <div className="setting-item">
                        <button onClick={handleExport} className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }}>
                            Экспортировать данные в JSON
                        </button>

                        {/* Обёртка для импорта, чтобы стилизовать как кнопку */}
                        <label htmlFor="import-file" className="btn btn-outline" style={{ width: '95.5%', cursor: 'pointer', display: 'inline-block', textAlign: 'center' }}>
                            Импортировать данные из JSON
                        </label>
                        <input
                            id="import-file"
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="setting-actions">
                    <button onClick={handleSave} className="btn btn-primary">
                        Сохранить настройки
                    </button>
                    <button onClick={handleReset} className="btn btn-danger">
                        Сбросить все данные
                    </button>
                </div>
            </div>

            <div className="app-info">
                <h3>Информация о приложении</h3>
                <p>Версия: 1.0.0</p>
                <p>Разработчик: Трекер Технологий</p>
                <p>© 2025</p>
            </div>

            {/* Модальное окно для сообщений */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Результат операции"
            >
                <p>{modalMessage}</p>
                <button
                    className="modal-close-button"
                    onClick={() => setIsModalOpen(false)}
                >
                    Закрыть
                </button>
            </Modal>
        </div>
    );
}

export default Settings;