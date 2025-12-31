/**
 * API请求工具
 * 统一管理所有后端接口调用
 */

const API_BASE_URL = 'https://dlmtfxvhitev.sealoshzh.site/api';

/**
 * 获取Token
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * 获取RefreshToken
 */
function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

/**
 * 保存Token
 */
function saveToken(token, refreshToken) {
    localStorage.setItem('token', token);
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
}

/**
 * 清除Token
 */
function clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_info');
}

/**
 * 刷新Token
 */
async function refreshToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error('未找到刷新Token');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();
        
        if (data.code === 200) {
            saveToken(data.data.token, null);
            return data.data.token;
        } else {
            clearToken();
            throw new Error(data.message || 'Token刷新失败');
        }
    } catch (error) {
        clearToken();
        throw error;
    }
}

/**
 * 通用请求方法
 */
async function request(url, options = {}) {
    const token = getToken();
    
    // 设置默认请求头
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // 如果需要认证，添加Token
    if (options.requireAuth !== false && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 合并请求选项
    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const data = await response.json();

        // Token过期，尝试刷新
        if (data.code === 401 && token && options.requireAuth !== false) {
            try {
                const newToken = await refreshToken();
                // 重新请求
                headers['Authorization'] = `Bearer ${newToken}`;
                const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
                    ...config,
                    headers
                });
                const retryData = await retryResponse.json();
                return retryData;
            } catch (refreshError) {
                // 刷新失败，跳转登录
                clearToken();
                if (window.location.pathname !== '/src/frontend/index.html') {
                    window.location.href = 'index.html';
                }
                throw new Error('登录已过期，请重新登录');
            }
        }

        return data;
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}

/**
 * GET请求
 */
async function get(url, params = {}, requireAuth = true) {
    const queryString = Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    const urlWithParams = queryString ? `${url}?${queryString}` : url;
    
    return request(urlWithParams, {
        method: 'GET',
        requireAuth
    });
}

/**
 * POST请求
 */
async function post(url, data = {}, requireAuth = true) {
    return request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        requireAuth
    });
}

/**
 * PUT请求
 */
async function put(url, data = {}, requireAuth = true) {
    return request(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        requireAuth
    });
}

/**
 * DELETE请求
 */
async function del(url, requireAuth = true) {
    return request(url, {
        method: 'DELETE',
        requireAuth
    });
}

/**
 * 文件上传
 */
async function uploadFile(url, file, type = 'post', requireAuth = true) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = getToken();
    const headers = {};
    
    if (requireAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
}

// ==================== 用户认证模块 ====================

/**
 * 用户注册
 */
async function register(username, password, email = null, phone = null) {
    const response = await post('/auth/register', {
        username,
        password,
        email,
        phone
    }, false);
    
    // 注册成功后自动保存Token
    if (response.code === 200 && response.data.token) {
        saveToken(response.data.token, response.data.refreshToken);
        // 保存用户信息
        localStorage.setItem('user_info', JSON.stringify({
            userId: response.data.userId,
            username: response.data.username,
            avatar: response.data.avatar || null
        }));
    }
    
    return response;
}

/**
 * 用户登录
 */
async function login(username, password, rememberMe = false) {
    const response = await post('/auth/login', {
        username,
        password,
        rememberMe
    }, false);

    if (response.code === 200) {
        saveToken(response.data.token, response.data.refreshToken);
        // 保存用户信息
        localStorage.setItem('user_info', JSON.stringify({
            userId: response.data.userId,
            username: response.data.username,
            avatar: response.data.avatar
        }));
    }

    return response;
}

/**
 * 用户登出
 */
async function logout() {
    try {
        await post('/auth/logout');
    } catch (error) {
        console.error('登出失败:', error);
    } finally {
        clearToken();
    }
}

/**
 * 忘记密码
 */
async function forgotPassword(email) {
    return post('/auth/forgot-password', { email }, false);
}

// ==================== 用户信息模块 ====================

/**
 * 获取用户信息
 */
async function getUserProfile() {
    const response = await get('/user/profile');
    if (response.code === 200) {
        localStorage.setItem('user_info', JSON.stringify(response.data));
    }
    return response;
}

/**
 * 更新用户信息
 */
async function updateUserProfile(data) {
    return put('/user/profile', data);
}

/**
 * 上传头像
 */
async function uploadAvatar(file) {
    return uploadFile('/user/avatar', file, 'avatar');
}

/**
 * 获取用户统计数据
 * @param {string} period - 时间周期：today/week/month/year/all，默认all
 */
async function getUserStats(period = 'all') {
    return get('/user/stats', { period });
}

// ==================== 训练计划模块 ====================

/**
 * 创建训练计划（手动）
 */
async function createPlan(planData) {
    return post('/plans', planData);
}

/**
 * AI生成训练计划
 * @param {string} target - 训练目标：weight-loss/muscle-gain/endurance/strength/flexibility（必填）
 * @param {Array<string>} requirements - 需求列表（可选）
 * @param {string} customRequirement - 自定义需求描述（可选）
 */
async function generatePlan(target, requirements = [], customRequirement = '') {
    return post('/plans/ai-generate', {
        target,
        requirements,
        customRequirement
    });
}

/**
 * 获取训练计划列表
 */
async function getPlans(params = {}) {
    return get('/plans', params);
}

/**
 * 获取训练计划详情
 */
async function getPlanDetail(planId) {
    return get(`/plans/${planId}`);
}

/**
 * 更新训练计划
 */
async function updatePlan(planId, planData) {
    return put(`/plans/${planId}`, planData);
}

/**
 * 删除训练计划
 */
async function deletePlan(planId) {
    return del(`/plans/${planId}`);
}

// ==================== 日历模块 ====================

/**
 * 获取日历数据
 */
async function getCalendar(year = null, month = null) {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return get('/calendar', params);
}

/**
 * 添加计划到日历
 */
async function addPlanToCalendar(planId, date, time = null, repeat = 'none') {
    return post('/calendar/plans', {
        planId,
        date,
        time,
        repeat
    });
}

/**
 * 更新日历计划状态
 */
async function updateCalendarPlan(calendarId, data) {
    return put(`/calendar/plans/${calendarId}`, data);
}

/**
 * 删除日历计划
 */
async function deleteCalendarPlan(calendarId) {
    return del(`/calendar/plans/${calendarId}`);
}

/**
 * 获取某日计划详情
 */
async function getDayPlans(date) {
    return get(`/calendar/plans/date/${date}`);
}

// ==================== AI助手模块 ====================

/**
 * AI对话
 * @param {string} message - 用户消息（必填）
 * @param {string} conversationId - 对话ID（可选，用于多轮对话）
 * @param {Object} context - 上下文信息（可选）
 * @param {string} context.currentPlan - 当前计划ID
 * @param {Array} context.recentExercises - 最近训练动作
 */
async function aiChat(message, conversationId = null, context = {}) {
    return post('/ai/chat', {
        message,
        conversationId,
        context
    });
}

/**
 * 获取对话历史
 */
async function getConversations(page = 1, pageSize = 10) {
    return get('/ai/conversations', { page, pageSize });
}

/**
 * 获取单次对话详情
 */
async function getConversationDetail(conversationId) {
    return get(`/ai/conversations/${conversationId}`);
}

/**
 * 删除对话
 */
async function deleteConversation(conversationId) {
    return del(`/ai/conversations/${conversationId}`);
}

/**
 * AI训练纠错
 * @param {string} exerciseName - 动作名称（必填）
 * @param {string} userDescription - 用户描述的动作执行情况、遇到的问题（必填）
 * @param {Object} planContext - 计划上下文信息（可选）
 * @param {string} planContext.planId - 当前计划ID
 * @param {string} planContext.difficulty - 计划难度
 * @param {number} planContext.currentSets - 当前组数
 * @param {string} planContext.currentReps - 当前次数
 */
async function aiTrainingCorrection(exerciseName, userDescription, planContext = {}) {
    return post('/ai/correction', {
        exerciseName,
        userDescription,
        planContext
    });
}

// ==================== 统计数据模块 ====================

/**
 * 获取统计数据
 * @param {string} period - 时间周期：today/week/month/year/all，默认all
 * @param {string} type - 统计类型：all/calories/water/heart/exercise，默认all
 */
async function getStatistics(period = 'all', type = 'all') {
    return get('/statistics', { period, type });
}

/**
 * 获取训练记录列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.startDate - 开始日期，格式：YYYY-MM-DD
 * @param {string} params.endDate - 结束日期，格式：YYYY-MM-DD
 * @param {string} params.planId - 计划ID筛选
 */
async function getTrainingSessions(params = {}) {
    return get('/statistics/sessions', params);
}

/**
 * 保存训练记录
 * @param {Object} sessionData - 训练记录数据
 * @param {string} sessionData.planId - 计划ID（必填）
 * @param {string} sessionData.calendarId - 日历计划ID（可选）
 * @param {string} sessionData.date - 训练日期，格式：YYYY-MM-DD（必填）
 * @param {number} sessionData.duration - 实际训练时长（分钟）（必填）
 * @param {Array} sessionData.exercises - 完成的动作列表（可选）
 * @param {string} sessionData.notes - 训练备注（可选）
 */
async function saveTrainingSession(sessionData) {
    return post('/statistics/sessions', sessionData);
}

// ==================== 社区模块 ====================

/**
 * 获取帖子列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.category - 分类：discussion/suggestion/all，默认all
 * @param {string} params.tag - 标签筛选
 * @param {string} params.sort - 排序：latest/popular/hot，默认latest
 */
async function getPosts(params = {}) {
    // 可选认证：如果有token则使用，没有也可以访问
    const token = getToken();
    return get('/community/posts', params, !!token);
}

/**
 * 发布帖子
 * @param {Object} postData - 帖子数据
 * @param {string} postData.title - 标题（必填）
 * @param {string} postData.content - 内容（必填）
 * @param {Array<string>} postData.images - 图片URL列表（可选）
 * @param {Array<string>} postData.tags - 标签列表（可选）
 * @param {string} postData.category - 分类：discussion/suggestion，默认discussion（可选）
 */
async function createPost(postData) {
    return post('/community/posts', postData);
}

/**
 * 获取帖子详情
 * @param {string} postId - 帖子ID
 */
async function getPostDetail(postId) {
    // 可选认证：如果有token则使用，没有也可以访问
    const token = getToken();
    return get(`/community/posts/${postId}`, {}, !!token);
}

/**
 * 点赞/取消点赞
 */
async function likePost(postId) {
    return post(`/community/posts/${postId}/like`);
}

/**
 * 评论帖子
 */
async function commentPost(postId, content, parentId = null) {
    return post(`/community/posts/${postId}/comments`, {
        content,
        parentId
    });
}

/**
 * 删除帖子
 */
async function deletePost(postId) {
    return del(`/community/posts/${postId}`);
}

/**
 * 获取商城商品列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.category - 分类：equipment/supplement/clothing/accessory
 * @param {string} params.sort - 排序：price_asc/price_desc/popular/latest，默认latest
 */
async function getMarketplaceProducts(params = {}) {
    // 可选认证：如果有token则使用，没有也可以访问
    const token = getToken();
    return get('/community/marketplace', params, !!token);
}

/**
 * 获取商品详情
 * @param {string} productId - 商品ID
 */
async function getProductDetail(productId) {
    // 可选认证：如果有token则使用，没有也可以访问
    const token = getToken();
    return get(`/community/marketplace/${productId}`, {}, !!token);
}

/**
 * 创建订单
 * @param {Object} orderData - 订单数据
 * @param {string} orderData.productId - 商品ID（必填）
 * @param {number} orderData.quantity - 数量（必填）
 * @param {Object} orderData.address - 收货地址（必填）
 * @param {string} orderData.address.name - 收货人姓名
 * @param {string} orderData.address.phone - 联系电话
 * @param {string} orderData.address.address - 详细地址
 */
async function createOrder(orderData) {
    return post('/community/orders', orderData);
}

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.status - 订单状态：pending/paid/shipped/completed/cancelled
 */
async function getOrders(params = {}) {
    return get('/community/orders', params);
}

// ==================== 文件上传模块 ====================

/**
 * 上传图片
 * @param {File} file - 图片文件（必填，最大5MB）
 * @param {string} type - 类型：avatar/post/equipment，默认post
 */
async function uploadImage(file, type = 'post') {
    return uploadFile('/upload/image', file, type);
}

// ==================== 首页数据模块 ====================

/**
 * 获取首页数据
 */
async function getHomeData() {
    return get('/home');
}

// ==================== 通知模块 ====================

/**
 * 获取通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.type - 类型：all/system/social/order，默认all
 * @param {boolean} params.unreadOnly - 是否只获取未读，默认false
 */
async function getNotifications(params = {}) {
    return get('/notifications', params);
}

/**
 * 标记通知为已读
 */
async function markNotificationRead(notificationId) {
    return put(`/notifications/${notificationId}/read`);
}

/**
 * 全部标记为已读
 */
async function markAllNotificationsRead() {
    return put('/notifications/read-all');
}

// 导出所有API方法
const API = {
    // Token管理
    getToken,
    saveToken,
    clearToken,

    // 用户认证
    register,
    login,
    logout,
    forgotPassword,

    // 用户信息
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
    getUserStats,

    // 训练计划
    createPlan,
    generatePlan,
    getPlans,
    getPlanDetail,
    updatePlan,
    deletePlan,

    // 日历
    getCalendar,
    addPlanToCalendar,
    updateCalendarPlan,
    deleteCalendarPlan,
    getDayPlans,

    // AI助手
    aiChat,
    aiTrainingCorrection,
    getConversations,
    getConversationDetail,
    deleteConversation,

    // 统计数据
    getStatistics,
    getTrainingSessions,
    saveTrainingSession,

    // 社区
    getPosts,
    createPost,
    getPostDetail,
    likePost,
    commentPost,
    deletePost,
    getMarketplaceProducts,
    getProductDetail,
    createOrder,
    getOrders,

    // 文件上传
    uploadImage,

    // 首页数据
    getHomeData,

    // 通知
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
};

// 挂载到window对象供全局使用
window.API = API;

