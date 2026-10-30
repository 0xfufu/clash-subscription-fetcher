# 免费Clash订阅获取器

一个用于获取最新免费 Clash 订阅地址的 Web 应用。

## 功能

- 自动获取最新发布的免费节点信息
- 提取节点标题和最新检测时间（格式：YYYY-MM-DD HH:MM 或 YYYY-MM-DD HH:MM:SS）
- 获取 Clash / Mihomo 免费订阅地址（YAML 格式）
- 提供简洁的 Web 界面展示结果
- 一键复制免费订阅地址
- 停止服务并关闭页面

## 技术栈

- **后端**: Node.js + Express
- **HTTP 请求**: Axios
- **HTML 解析**: Cheerio
- **前端**: 原生 HTML + CSS + JavaScript

## 安装

1. 克隆或下载项目
2. 安装依赖：

```bash
npm install
```

## 使用

启动服务器：

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动，并自动在浏览器中打开页面。

![界面截图](images/截屏2026-10-30%2017.20.59.png)

点击"获取最新免费订阅"按钮即可获取最新的免费 VPN 订阅信息。点击"复制"按钮可快速复制订阅地址。点击"停止服务"按钮可关闭服务器。

![界面截图2](images/截屏2026-10-30%2017.21.08.png)

## API 接口

### GET /api/scrape

抓取最新的免费 VPN 订阅信息。

**响应示例：**

```json
{
  "title": "2026年10月30日免费节点更新，附 21 个节点订阅｜Clash / V2ray / 小火箭 Shadowrocket",
  "date": "2026-10-30 14:30:00",
  "subscriptionUrl": "https://nodesub.v2raydog.com/2026/10/v2raydog-20261030.yaml"
}
```

### GET /api/stop

停止服务器。

**响应示例：**

```json
{
  "message": "Server stopping"
}
```

## 项目结构

```
project/
├── public/
│   └── index.html          # 前端页面
├── server.js               # 后端服务器
├── package.json            # 项目配置
└── README.md               # 项目文档
```

## 注意事项

- 本项目仅用于学习和研究目的
- 请遵守相关网站的使用条款
- 订阅地址的有效性由源网站维护

## 许可证

ISC

## 数据来源

本应用获取的数据来源于 https://v2raydog.com 网站
