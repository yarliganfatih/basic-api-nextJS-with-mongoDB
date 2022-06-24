import Head from 'next/head'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  try {
    const client = await clientPromise
    const db = client.db("auth")
    const getdata = await db.collection('users').find({})
    const users = []
    await getdata.forEach(element => users.push(element))
    res.status(200).json(users)
  } catch (e) {
    res.status(400).json({ success: false })
    console.error(e)
  }
}
