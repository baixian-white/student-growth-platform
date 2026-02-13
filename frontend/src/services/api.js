const API_BASE = '/api';

// 学生 API
export const studentAPI = {
    // 获取所有学生
    getAllStudents: async () => {
        const response = await fetch(`${API_BASE}/students`);
        if (!response.ok) throw new Error('获取学生列表失败');
        return response.json();
    },

    // 根据 ID 获取学生
    getStudentById: async (id) => {
        const response = await fetch(`${API_BASE}/students/${id}`);
        if (!response.ok) throw new Error('获取学生详情失败');
        return response.json();
    },

    // 创建学生
    createStudent: async (studentData) => {
        const response = await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        if (!response.ok) throw new Error('创建学生失败');
        return response.json();
    },

    // 更新学生
    updateStudent: async (id, studentData) => {
        const response = await fetch(`${API_BASE}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        if (!response.ok) throw new Error('更新学生失败');
        return response.json();
    },

    // 删除学生
    deleteStudent: async (id) => {
        const response = await fetch(`${API_BASE}/students/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('删除学生失败');
    },

    // 搜索学生
    searchStudents: async (keyword) => {
        const response = await fetch(`${API_BASE}/students/search?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('搜索学生失败');
        return response.json();
    }
};

// 考试信息 API
export const examAPI = {
    // 获取所有考试信息
    getAllExams: async () => {
        const response = await fetch(`${API_BASE}/exam-info`);
        if (!response.ok) throw new Error('获取考试信息失败');
        return response.json();
    },

    // 根据 ID 获取考试信息
    getExamById: async (id) => {
        const response = await fetch(`${API_BASE}/exam-info/${id}`);
        if (!response.ok) throw new Error('获取考试详情失败');
        return response.json();
    },

    // 搜索考试
    searchExams: async (keyword) => {
        const response = await fetch(`${API_BASE}/exam-info/search?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('搜索考试失败');
        return response.json();
    },

    // 按分类获取考试
    getExamsByCategory: async (category) => {
        const response = await fetch(`${API_BASE}/exam-info/category/${encodeURIComponent(category)}`);
        if (!response.ok) throw new Error('获取分类考试失败');
        return response.json();
    },

    // 获取推荐考试
    getRecommendedExams: async () => {
        const response = await fetch(`${API_BASE}/exam-info/recommended`);
        if (!response.ok) throw new Error('获取推荐考试失败');
        return response.json();
    }
};

// 团队成员 API
export const teamAPI = {
    // 获取所有团队成员
    getAllMembers: async () => {
        const response = await fetch(`${API_BASE}/team`);
        if (!response.ok) throw new Error('获取团队成员失败');
        return response.json();
    },

    // 根据 ID 获取团队成员
    getMemberById: async (id) => {
        const response = await fetch(`${API_BASE}/team/${id}`);
        if (!response.ok) throw new Error('获取团队成员详情失败');
        return response.json();
    }
};
