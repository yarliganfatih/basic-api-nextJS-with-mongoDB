import Head from 'next/head'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const userModel = client.db("auth").collection('users')
  switch (req.method) {
    case 'POST':
      try {
        const user = await userModel.insert(req.body) // TODO Be Filtered
        console.log(user)
        res.status(201).json({ success: true, data: user })
      } catch (error) {
        res.status(400).json({ success: false, errorMsg: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, errorMsg: 'Method Not Allowed' })
      break
  }
}
