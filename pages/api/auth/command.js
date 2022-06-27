import Head from 'next/head'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const client = await clientPromise
    const userModel = client.db("auth").collection('users')
    try {
        const data = await userModel.createIndex({ "email": 1 }, { unique: true })
        console.log(data)
        res.status(201).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, errorMsg: error.message })
    }
}