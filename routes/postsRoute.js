const express = require('express');
const router = express.Router();

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
// Model
const { Posts } = require('../models');
const { Op } = require('sequelize');

// 게시글 작성 API (POST)
router.post('/posts', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const post = await Posts.create({
        userId: userId,
        title: title,
        content: content,
    });

    return res.status(201).json({ data: post });
});

// 게시글 목록 조회 API (GET)
router.get('/posts', async (req, res) => {
    const posts = await Posts.findAll({
        attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
});

// 게시글 수정 API (PUT)
router.put('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
        return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    } else if (post.userId !== userId) {
        return res.status(401).json({ message: '권한이 없습니다.' });
    }

    await Posts.update(
        { title, content },
        {
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        },
    );
    return res.status(200).json({ data: '게시글이 수정되었습니다.' });
});

// 게시글 삭제 API (DELETE)
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title } = res.req.body;

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
        return res.status(404).json({ message: '게시글이 없습니다.' });
    } else if (post.userId !== userId) {
        return res.status(404).json({ message: '권한이 없습니다.' });
    } else if (post.title !== title) {
        return res.status(401).json({ message: '제목이 일치하지 않습니다.' });
    }

    await Posts.destroy({
        where: {
            [Op.and]: [{ postId }, { userId }],
        },
    });
    return res.status(200).json({ data: '게시글이 삭제되었습니다.' });
});

module.exports = router;
