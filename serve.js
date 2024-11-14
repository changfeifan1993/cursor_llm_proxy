const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Readable } = require('stream');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
    try {
        // 打印原始请求信息
        console.log(`接收到 POST 请求: ${req.method} ${req.originalUrl}`);
        console.log('请求头:', req.headers);
        console.log('原始请求体:', JSON.stringify(req.body));

        // 修改请求体
        const modifiedBody = {
            ...req.body,
            model: 'llama3.2-vision'
        };
        
        console.log('修改后的请求体:', JSON.stringify(modifiedBody));

        // 转发到 12345 端口
        const response = await axios.post('http://localhost:12344/v1/chat/completions', modifiedBody, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'stream'
        });

        // 设置响应头
        res.setHeader('Content-Type', 'application/json');

        // 创建可读流
        const stream = new Readable().wrap(response.data);

        // 将流式数据逐步返回给客户端
        stream.pipe(res);
    } catch (error) {
        console.error('请求处理错误:', error);
        res.status(500).json({ error: '请求处理失败', details: error.message });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.listen(3001, () => {
    console.log('服务器正在运行： http://localhost:3001');
});