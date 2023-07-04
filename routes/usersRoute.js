const express = require('express');
const router = express.Router();

// Middleware
const authMiddleware = require('../middleware/authMiddleware.js');

// JWT
const jwt = require('jsonwebtoken');
// Model
const { Users } = require('../models/index.js');
const { Op } = require('sequelize');

// 회원가입 API (POST)

// log-in API (POST)

// log-out API (POST)
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        res.clearCookie('authorization');
        return res.status(200).json({ message: 'log-out 되었습니다.' });
    } catch {
        return res.status(400).json({ message: 'log-out에 실패하였습니다.' });
    }
});

// 사용자 정보 조회 API (GET)
router.get('/users/:userId', authMiddleware, async (req, res) => {
    const paramsUserId = req.params.userId; // from params, type: string
    const { userId } = res.locals.user; // from authMiddleware, type: number

    try {
        if (paramsUserId !== String(userId)) {
            return res.status(403).json({ message: '권한이 존재하지 않습니다.' });
        } else if (paramsUserId === String(userId)) {
            const user = await Users.findOne({
                attributes: ['userId', 'email', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: UserInfos, // 1:1 관계를 맺고있는 UserInfos(table)를 조회합니다.
                        attributes: ['nickname', 'userDesc'],
                    },
                ],
                where: { userId: paramsUserId },
            });

            return res.status(200).json({ data: user });
        }
        // try => catch
    } catch {
        return res.status(400).json({ message: '사용자 정보 조회에 실패하였습니다.' });
    }
});

// 사용자 정보 수정 API (PUT)
router.put('/users/:userId', authMiddleware, async (req, res) => {
    const paramsUserId = req.params.userId;
    const { userId } = res.locals.user;
    const { password, newNickname, userDesc, newPassword, newPasswordConfirm } = req.body;
    const existUser = await Users.findOne({ where: { userId } });
    const exitsUserInfo = await UserInfos.findOne({ where: { userId } });
    const newNicknameCheck = await UserInfos.findOne({ where: { nickname: newNickname } });
    // 암호화 관련
    const passwordMatch = await bcrypt.compare(password, existUser.password);
    const hashedNewPassword = newPassword ? await bcrypt.hash(newPassword, 10) : null;

    try {
        if (paramsUserId !== String(userId)) {
            return res.status(403).json({ message: '권한이 존재하지 않습니다.' });
        } else if (paramsUserId === String(userId)) {
            if (!password) {
                return res.status(400).json({ message: 'password를 입력해주세요.' });
            }
            if (!passwordMatch) {
                return res.status(400).json({ message: 'password가 일치하지 않습니다.' });
            }
            // 사용자가 nickname을 변경했을 경우
            if (newNickname) {
                if (!newNickname || newNickname.length < 3 || !/^[a-z A-Z 0-9]+$/.test(newNickname)) {
                    return res.status(412).json({ message: '변경된 nickname의 형식이 올바르지 않습니다.' });
                }
                if (newNicknameCheck) {
                    return res.status(412).json({ message: '중복된 nickname입니다.' });
                }
            }
            // 사용자가 password를 변경했을 경우
            if (newPassword || newPasswordConfirm) {
                if (newPassword !== newPasswordConfirm) {
                    return res.status(412).json({ message: '변경된 password가 일치하지 않습니다.' });
                }
                if (!newPassword || newPassword.length < 4 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(newPassword)) {
                    return res.status(412).json({ message: '변경된 password 형식이 올바르지 않습니다.' });
                }
                if (newPassword.includes(newNickname)) {
                    return res.status(412).json({ message: '변경된 password에 nickname이 포함되어 있습니다.' });
                }
            }
            await Users.update(
                {
                    // 사용자가 password를 변경했을 경우 || 변경하지 않았을 경우
                    password: hashedNewPassword || existUser.password,
                },
                { where: { userId } },
            );
            await UserInfos.update(
                {
                    // 사용자가 nickname을 변경했을 경우 || 변경하지 않았을 경우
                    nickname: newNickname || exitsUserInfo.nickname,
                    userDesc: userDesc,
                },
                { where: { userId } },
            );
            return res.status(200).json({ message: '사용자 정보 수정에 성공하였습니다.' });
        }
        // try => catch
    } catch {
        return res.status(400).json({ message: '사용자 정보 수정에 실패하였습니다.' });
    }
});

// 회원탈퇴 API (DELETE)
router.delete('/users/:userId', authMiddleware, async (req, res) => {
    const paramsUserId = req.params.userId;
    const { userId } = res.locals.user;
    const { email, password } = req.body;
    const existUser = await Users.findOne({ where: { userId } });
    // 암호화 관련
    const passwordMatch = await bcrypt.compare(password, existUser.password);

    try {
        if (paramsUserId !== String(userId)) {
            return res.status(403).json({ message: '권한이 존재하지 않습니다.' });
        } else if (paramsUserId === String(userId)) {
            if (!email) {
                return res.status(412).json({ message: 'email을 입력해주세요.' });
            }
            if (!password) {
                return res.status(412).json({ message: 'password를 입력해주세요.' });
            }
            if (email !== existUser.email || !passwordMatch) {
                return res.status(412).json({ message: 'email 또는 password를 확인해주세요.' });
            }

            await Users.destroy({
                where: {
                    [Op.and]: [{ userId }, { email: existUser.email }],
                },
            });

            return res.status(200).json({ message: '사용자 정보 삭제에 성공하였습니다.' });
        }
        // try => catch
    } catch {
        return res.status(400).json({ message: '사용자 정보 조회에 실패하였습니다.' });
    }
});

module.exports = router;
