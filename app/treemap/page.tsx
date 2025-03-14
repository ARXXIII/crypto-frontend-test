'use client'

import { useCallback, useEffect, useState } from "react"

import { TreeMap } from "@/components/treemap/treemap"

const TreeMapPage = () => {
    const [data, setData] = useState()

    const fetchTreeMapData = useCallback(async () => {
        try {
            const response = await fetch('/api/treemap')
            const data = await response.json()
            setData(data)
        } catch (error) {
            console.error('TREEMAP PAGE ERROR', error)
        }
    }, [])

    useEffect(() => {
        fetchTreeMapData()
    }, [fetchTreeMapData])

    if (data) {
        return (
            <div className="flex justify-center">
                <TreeMap data={data} />
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            <p>Loading...</p>
        </div>
    )
}

export default TreeMapPage