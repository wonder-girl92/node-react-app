const Profession = require('../models/Profession')
const Quality = require('../models/Quality')

const professionMock = require('../mock/professions.json')
const qualitiesMock = require('../mock/qualities.json')

module.exports = async () => {
  const professions = await Profession.find()
  if(professions.length !== professionMock.length) {
    await createInitialEntity(Profession, professionMock)
  }
}

async function createInitialEntity(Model, data) {
  await Model.collection.drop()
  return Promise.all(
    data.map(async item => {
      try {
        delete item._id
          //удаляем id, чтоб он не записывался в БД
        const newItem = new Model(item)
        await newItem.save()
          //метод save записывает в mongodb локальные данные, которые мы пишем тут
        return newItem
      } catch (e) {
        return e
      }
    })
  )
}
