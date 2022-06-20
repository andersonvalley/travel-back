require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { checkAuth, handlerValidationErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'
import { registerValidation, loginValidation, postCreateValidation } from './validations/index.js'

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('db connected')
  })
  .catch(err => console.log('db error', err))

const app = express()
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handlerValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handlerValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handlerValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handlerValidationErrors, PostController.update)

app.listen(process.env.PORT || 5000, err => {
  if (err) {
    return console.log(err)
  }

  console.log('server OK')
})
