import { NextRequest, NextResponse } from 'next/server'

import data1 from '@/public/1.json'
import data2 from '@/public/2.json'
import data3 from '@/public/3.json'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ path: string }> }
) {
	const { path } = await params

	try {
		if (path) {
			let response
			switch (path) {
				case '1':
					response = data1
					break
				case '2':
					response = data2
					break
				case '3':
					response = data3
					break
				default:
					throw new Error('Invalid path')
			}

			const data = response

			return NextResponse.json(data)
		}
	} catch (error) {
		console.error('GRAPH API ERROR', error)
		return NextResponse.json('Internal server error', { status: 500 })
	}
}
