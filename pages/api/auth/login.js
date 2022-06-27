import Head from 'next/head'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const userModel = client.db("auth").collection('users')
  let reqData = req.query
  switch (req.method) {
    case 'POST':
      reqData = req.body
      break
    default:
      res.status(400).json({ success: false })
      break
  }
  try {
    const user = await userModel.findOne({ "email": reqData.email, "password": reqData.password })
    console.log(user)
    if (user != null) {
      const jwt = require('jsonwebtoken')
      let accessTokenSecret = "vagustim"
      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret);
      res.status(200).json({ success: true, access_token: accessToken })
    } else {
      res.status(400).json({ success: false, errorMsg: 'Invalid Email or Password' })
    }
  } catch (error) {
    res.status(400).json({ success: false, errorMsg: error.message })
  }
}
