import mongoose from 'mongoose'

const CitiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: [
      {
        imageUrl: String,
        title: String,
      },
    ],
    map_info: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Cities', CitiesSchema)
