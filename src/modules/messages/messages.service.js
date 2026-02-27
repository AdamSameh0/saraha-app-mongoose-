import { BadRequestException, NotFoundException } from "../../common/index.js"
import { findById, findOne, messagesModel, userModel } from "../../database/index.js"



export const sendingMessage = async (data, id) => {
  let { message, image } = data
  let exist = await findById({ modelName: userModel, id })
  if (exist) {
    let addedMessage = await messagesModel.create({
      message,
      image,
      receiverId: id
    })
    if (addedMessage) {
      return addedMessage
    } else {
      throw BadRequestException({ message: "message didnt send" })
    }
  } else {
    throw NotFoundException({ message: "user not found" })
  }
}

export const getAllMessages = async (receiverId) => {
  let exist = await findById({ modelName: userModel, id: receiverId })
  if (!exist) {
    throw NotFoundException({ message: "invalide user" })
  } else {
    let messages = await messagesModel.find({ receiverId })
    if (messages.length) {
      return messages
    } else {
      throw NotFoundException({ message: "no messages found" })
    }
  }
}

export const getMessageById = async (userId, messageId) => {
  let exist = await findById({ modelName: userModel, id: userId })
  if (exist) {
    let message = await findOne({ modelName: messagesModel, filter: { _id: messageId, receiverId: userId } })
    if (!message) {
      throw NotFoundException({ message: "message not found" })
    } else {
      return message
    }
  } else {
    throw NotFoundException({ message: "user not found" })
  }
}

export const deleteMessageById = async (userId, messageId) => {
  let exist = await findById({ modelName: userModel, id: userId })
  if (exist) {
    let deleting = await messagesModel.findByIdAndDelete({ _id: messageId, receiverId: userId })
    if (!deleting) {
      throw NotFoundException({ message: "message not found" })
    } else {
      return deleting
    }
  } else {
    throw NotFoundException({ message: "user not found" })
  }
}