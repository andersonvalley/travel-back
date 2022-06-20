import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      password: hashedPassword,
      avatar: req.body.avatar,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' }
    )

    const { password, ...userData } = user._doc

    res.json({ ...userData, token })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'не удалось зарегистрироваться',
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' }
    )

    const { password, ...userData } = user._doc

    res.json({ ...userData, token })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: ' Не удалось авторизоваться',
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId })

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const { password, ...userData } = user._doc

    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: ' Нет доступа',
    })
  }
}
