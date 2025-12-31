# 前端API对接说明

## 概述

所有前端页面已对接后端API接口，使用统一的API工具 `js/api.js` 进行接口调用。

## API工具文件

**文件路径：** `src/frontend/js/api.js`

**基础URL：** `https://dlmtfxvhitev.sealoshzh.site/api`

## 使用方法

### 1. 引入API工具

在所有HTML文件的 `<head>` 或 `</body>` 前添加：

```html
<script src="js/api.js"></script>
```

### 2. 调用API方法

所有API方法都挂载在 `window.API` 对象上，可以直接调用：

```javascript
// 登录示例
API.login('username', 'password', false)
  .then(response => {
    if (response.code === 200) {
      console.log('登录成功', response.data);
    }
  })
  .catch(error => {
    console.error('登录失败', error);
  });

// 获取用户信息示例
API.getUserProfile()
  .then(response => {
    if (response.code === 200) {
      console.log('用户信息', response.data);
    }
  });
```

## 已对接的页面

### ✅ 1. index.html - 登录页面
- **对接接口：** `POST /api/auth/login`
- **功能：** 用户登录，保存Token

### ✅ 2. register.html - 注册页面
- **对接接口：** `POST /api/auth/register`
- **功能：** 用户注册

### ✅ 3. home.html - 首页
- **对接接口：** `GET /api/home`
- **功能：** 获取首页数据（用户信息、当前计划、今日数据、最近训练）

### ✅ 4. profile.html - 个人中心
- **对接接口：** 
  - `GET /api/user/profile` - 获取用户信息
  - `POST /api/auth/logout` - 退出登录
- **功能：** 显示用户信息、统计数据

### ✅ 5. manual-plan-creator.html - 手动创建计划
- **对接接口：** `POST /api/plans`
- **功能：** 创建训练计划

### ✅ 6. ai-assistant.html - AI助手
- **对接接口：**
  - `POST /api/plans/ai-generate` - AI生成计划
  - `POST /api/ai/chat` - AI对话
  - `POST /api/calendar/plans` - 同步计划到日历
- **功能：** AI生成计划、AI对话、同步到日历

### ✅ 7. calendar.html - 日历页面
- **对接接口：**
  - `GET /api/calendar` - 获取日历数据
  - `GET /api/calendar/plans/date/{date}` - 获取某日计划
  - `DELETE /api/calendar/plans/{calendarId}` - 删除日历计划
- **功能：** 显示日历、管理计划

### ✅ 8. statistics.html - 统计数据
- **对接接口：** `GET /api/statistics`
- **功能：** 获取统计数据、图表数据

### ✅ 9. community.html - 社区页面
- **对接接口：**
  - `GET /api/community/posts` - 获取帖子列表
  - `POST /api/community/posts` - 发布帖子
  - `POST /api/community/posts/{postId}/like` - 点赞
  - `GET /api/community/marketplace` - 获取商品列表
- **功能：** 帖子列表、发布帖子、点赞、商品展示

## Token管理

### 自动Token管理

API工具会自动处理Token的存储、刷新和过期：

1. **登录后自动保存Token**
   ```javascript
   API.login(username, password)
     .then(response => {
       // Token已自动保存到localStorage
     });
   ```

2. **自动添加Token到请求头**
   - 所有需要认证的接口会自动在请求头添加 `Authorization: Bearer {token}`

3. **Token自动刷新**
   - 当Token过期（401错误）时，自动使用refreshToken刷新
   - 刷新失败时自动跳转到登录页

4. **登出清除Token**
   ```javascript
   API.logout(); // 自动清除Token
   ```

### 手动Token管理

```javascript
// 获取Token
const token = API.getToken();

// 清除Token
API.clearToken();
```

## 错误处理

### 统一错误格式

所有API返回统一的错误格式：

```json
{
  "code": 400,
  "message": "错误描述",
  "data": null,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 错误处理示例

```javascript
API.getUserProfile()
  .then(response => {
    if (response.code === 200) {
      // 成功处理
      console.log(response.data);
    } else {
      // 业务错误
      alert(response.message);
    }
  })
  .catch(error => {
    // 网络错误或其他异常
    console.error('请求失败:', error);
    alert('网络错误，请稍后重试');
  });
```

## 文件上传

### 上传图片示例

```javascript
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

API.uploadImage(file, 'avatar')
  .then(response => {
    if (response.code === 200) {
      console.log('上传成功', response.data.url);
    }
  });
```

## 注意事项

### 1. 页面加载检查

建议在需要认证的页面加载时检查Token：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const token = API.getToken();
  if (!token) {
    window.location.href = 'index.html';
    return;
  }
  
  // 加载页面数据
  loadPageData();
});
```

### 2. 错误处理

- 所有API调用都应该有错误处理
- 网络错误时提供友好的提示
- Token过期时自动跳转登录

### 3. 加载状态

- 在API调用时显示加载动画
- 请求完成后隐藏加载动画

### 4. 数据格式转换

- API返回的数据格式可能与前端显示格式不同
- 需要在显示前进行格式转换（如时间格式化）

## 测试建议

1. **测试Token过期场景**
   - 等待Token过期或手动清除Token
   - 验证是否自动刷新或跳转登录

2. **测试网络错误**
   - 断开网络连接
   - 验证错误提示是否友好

3. **测试数据加载**
   - 验证所有页面数据是否正确加载
   - 验证空数据状态是否正确显示

## 常见问题

### Q: API调用返回401错误？
A: 检查Token是否有效，API工具会自动尝试刷新Token。

### Q: 如何调试API请求？
A: 打开浏览器开发者工具，查看Network标签页，所有API请求都会显示。

### Q: 如何修改API基础URL？
A: 修改 `js/api.js` 文件中的 `API_BASE_URL` 常量。

### Q: 如何处理跨域问题？
A: 后端需要配置CORS，允许前端域名访问。

---

**最后更新：** 2024-01-01  
**维护者：** 前端开发团队

