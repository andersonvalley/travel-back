import CitiesModel from '../models/Cities.js'

export const getAll = async (req, res) => {
  try {
    const cities = await CitiesModel.find()

    res.json(cities)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: ' Не удалось получить города',
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new CitiesModel({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    })

    const city = await doc.save()

    res.json(city)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: ' Не удалось создать город',
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const cityId = req.params.id

    CitiesModel.findOneAndUpdate(
      {
        _id: cityId,
      },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: ' Не удалось вернуть город',
          })
        }

        if (!doc) {
          return res.status(404).json({ message: 'Город не найден' })
        }

        res.json(doc)
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: ' Не удалось получить город',
    })
  }
}
