'use client'

import { useCallback, useEffect, useState } from "react"

import Graph from "@/components/graph/graph"

interface Node {
    address: string
    address_name: string
    subnodes?: Node[]
}

const GraphPage = () => {
    const [nodes, setNodes] = useState<Node[]>()
    const [path, setPath] = useState<number>(1)

    const fetchNodes = useCallback(async () => {
        try {
            const response = await fetch(`/api/graph/1`)
            const data = await response.json()
            const { nodes } = await data
            setNodes(nodes)
        } catch (error) {
            console.error('Error fetching nodes:', error)
        }
    }, [])

    const loadMoreNodes = useCallback(async (address: string, isParent: boolean) => {
        if (path === 3) {
            return
        }

        try {
            const response = await fetch(`/api/graph/${path + 1}`)
            const data = await response.json()
            const { nodes } = data

            setNodes(prevNodes => {
                const updatedNodes = [...(prevNodes || [])]
                let nodeToUpdate

                if (!isParent) {
                    const parentNode = updatedNodes.find(node => node.subnodes)
                    nodeToUpdate = parentNode?.subnodes?.find(subnode => subnode.address === address)
                } else {
                    nodeToUpdate = updatedNodes.find(node => node.address === address)
                }

                if (nodeToUpdate) {
                    nodeToUpdate.subnodes = nodes
                }
                return updatedNodes
            })
            setPath((prevPath) => prevPath + 1)
        } catch (error) {
            console.error('Error fetching more nodes:', error)
        }
    }, [path])

    useEffect(() => {
        fetchNodes()
    }, [fetchNodes])

    if (nodes) {
        return (
            <div className="flex justify-center items-center" style={{
                height: window.innerHeight - 120
            }}>
                <Graph data={nodes} handleOnNodeClick={loadMoreNodes} />
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            <p>Loading...</p>
        </div>
    )
}

export default GraphPage