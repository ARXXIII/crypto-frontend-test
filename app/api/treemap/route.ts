import { NextResponse } from 'next/server'

const API_KEY = process.env.COINGECKO_API_KEY

export async function GET() {
	try {
		if (!API_KEY) {
			throw new Error('API_KEY is not defined')
		}

		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				'x-cg-demo-api-key': API_KEY,
			},
		}

		const response = await fetch(
			'https://api.coingecko.com/api/v3/coins/categories',
			options
		)
		const data = await response.json()

		return NextResponse.json(data)
	} catch (error) {
		console.error('TREEMAP API ERROR', error)
		return NextResponse.json('Internal server error', { status: 500 })
	}
}
