// useTechnologies.jsx
import useLocalStorage from './components/useLocalStorage';

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение базовых компонентов',
        status: 'not-started',
        category: 'frontend',
        notes: '',
        startDate: '',
        deadline: '',
        resources: ''
    },
    {
        id: 2,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript',
        status: 'not-started',
        category: 'backend',
        notes: '',
        startDate: '',
        deadline: '',
        resources: ''
    },
    {
        id: 3,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX',
        status: 'not-started',
        category: 'frontend',
        notes: '',
        startDate: '',
        deadline: '',
        resources: ''
    },
    {
        id: 4,
        title: 'State Management',
        description: 'Работа с состоянием компонентов',
        status: 'not-started',
        category: 'frontend',
        notes: '',
        startDate: '',
        deadline: '',
        resources: ''
    },
    {
        id: 5,
        title: 'React Hooks',
        description: 'Изучение useState, useEffect и других хуков',
        status: 'not-started',
        category: 'frontend',
        notes: '',
        startDate: '',
        deadline: '',
        resources: ''
    },
    {
        id: 6,
        title: 'React Router',
        description: 'Навигация между страницами в React приложении',
        status: 'not-started',
        category: 'frontend',
        notes: '',
        startDate: '',
        deadline: '',
        resources: ''
    }
];

// Валидатор структуры технологии
const isValidTechnology = (tech) => {
  return (
    tech &&
    typeof tech.id === 'number' &&
    typeof tech.title === 'string' &&
    typeof tech.status === 'string' &&
    ['not-started', 'in-progress', 'completed'].includes(tech.status) &&
    typeof tech.category === 'string' &&
    typeof tech.notes === 'string' &&
    (tech.startDate === '' || typeof tech.startDate === 'string') &&
    (tech.deadline === '' || typeof tech.deadline === 'string')
  );
};

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    const updateField = (techId, field, value) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, [field]: value } : tech
            )
        );
    };

    const updateStatus = (techId, newStatus) => {
        updateField(techId, 'status', newStatus);
    };

    const updateNotes = (techId, newNotes) => {
        updateField(techId, 'notes', newNotes);
    };

    const updateMultipleStatuses = (techIds, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                techIds.includes(tech.id) ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    // ✅ ЭКСПОРТ: возвращает строку JSON
    const exportData = () => {
        return JSON.stringify(technologies, null, 2);
    };

    // ✅ ИМПОРТ: принимает массив данных и валидирует
    const importData = (data) => {
        if (!Array.isArray(data)) {
            throw new Error('Данные должны быть массивом технологий');
        }

        const validTechnologies = [];
        for (const item of data) {
            if (!isValidTechnology(item)) {
                throw new Error('Некорректный формат данных: найдена невалидная технология');
            }
            validTechnologies.push(item);
        }

        // Проверка уникальности ID
        const ids = validTechnologies.map(t => t.id);
        if (new Set(ids).size !== ids.length) {
            throw new Error('Обнаружены дублирующиеся ID');
        }

        setTechnologies(validTechnologies);
        return validTechnologies.length;
    };

    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    return {
        technologies,
        updateField,
        updateStatus,
        updateNotes,
        updateMultipleStatuses,
        markAllCompleted,
        resetAllStatuses,
        exportData,
        importData,
        progress: calculateProgress()
    };
}

export default useTechnologies;