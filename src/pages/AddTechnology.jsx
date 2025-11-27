// pages/AddTechnology.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnology.css';

const CATEGORIES = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'devops', label: 'DevOps' },
    { value: 'other', label: 'Другое' }
];

function AddTechnology() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        startDate: '',
        deadline: '',
        resources: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Очищаем ошибку при вводе
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Название обязательно';
        if (!formData.startDate) newErrors.startDate = 'Укажите дату начала';
        if (!formData.deadline) newErrors.deadline = 'Укажите дедлайн';

        if (formData.startDate && formData.deadline) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.deadline);
            if (start > end) {
                newErrors.deadline = 'Дедлайн не может быть раньше начала';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Помечаем все поля как touched для отображения ошибок
        const allTouched = {};
        Object.keys(formData).forEach(key => allTouched[key] = true);
        setTouched(allTouched);

        if (!validate()) return;

        const newId = Date.now();

        const newTechnology = {
            id: newId,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            status: formData.status,
            startDate: formData.startDate,
            deadline: formData.deadline,
            resources: formData.resources.trim(),
            notes: formData.notes.trim()
        };

        const saved = localStorage.getItem('technologies');
        const technologies = saved ? JSON.parse(saved) : [];

        technologies.push(newTechnology);
        localStorage.setItem('technologies', JSON.stringify(technologies));

        navigate('/technologies');
    };

    // Установка сегодняшней даты как минимальной для выбора
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить новую технологию</h1>
                <button
                    onClick={() => navigate('/technologies')}
                    className="btn btn-secondary"
                    aria-label="Вернуться к списку технологий"
                >
                    ← Назад к списку
                </button>
            </div>

            <form onSubmit={handleSubmit} className="add-technology-form" noValidate>
                {/* Название */}
                <div className="form-group">
                    <label htmlFor="title">Название технологии *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Введите название технологии"
                        aria-invalid={!!errors.title && touched.title}
                        aria-describedby={errors.title && touched.title ? "title-error" : undefined}
                    />
                    {errors.title && touched.title && (
                        <p id="title-error" className="error-message" role="alert">
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Описание */}
                <div className="form-group">
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Введите описание технологии"
                        rows="3"
                    />
                </div>

                {/* Категория */}
                <div className="form-group">
                    <label htmlFor="category">Категория *</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-describedby={errors.category && touched.category ? "category-error" : undefined}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Статус */}
                <div className="form-group">
                    <label htmlFor="status">Статус изучения</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершено</option>
                    </select>
                </div>

                {/* Дата начала */}
                <div className="form-group">
                    <label htmlFor="startDate">Начало изучения *</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={today}
                        aria-invalid={!!errors.startDate && touched.startDate}
                        aria-describedby={errors.startDate && touched.startDate ? "startDate-error" : undefined}
                    />
                    {errors.startDate && touched.startDate && (
                        <p id="startDate-error" className="error-message" role="alert">
                            {errors.startDate}
                        </p>
                    )}
                </div>

                {/* Дедлайн */}
                <div className="form-group">
                    <label htmlFor="deadline">Дедлайн *</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={formData.startDate || today}
                        aria-invalid={!!errors.deadline && touched.deadline}
                        aria-describedby={errors.deadline && touched.deadline ? "deadline-error" : undefined}
                    />
                    {errors.deadline && touched.deadline && (
                        <p id="deadline-error" className="error-message" role="alert">
                            {errors.deadline}
                        </p>
                    )}
                </div>

                {/* Ресурсы */}
                <div className="form-group">
                    <label htmlFor="resources">Ресурсы для изучения</label>
                    <textarea
                        id="resources"
                        name="resources"
                        value={formData.resources}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Ссылки, курсы, книги и т.д."
                        rows="3"
                    />
                </div>

                {/* Заметки */}
                <div className="form-group">
                    <label htmlFor="notes">Мои заметки</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Записывайте сюда важные моменты..."
                        rows="4"
                    />
                </div>

                {/* Кнопки */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Добавить технологию
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                title: '',
                                description: '',
                                category: 'frontend',
                                status: 'not-started',
                                startDate: '',
                                deadline: '',
                                resources: '',
                                notes: ''
                            });
                            setTouched({});
                            setErrors({});
                        }}
                        className="btn btn-outline"
                    >
                        Очистить форму
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;