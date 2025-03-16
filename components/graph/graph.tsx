'use client'

import * as d3 from "d3"
import { useRef, useCallback, useEffect } from "react"

interface Node {
    address: string
    address_name: string
    subnodes?: Node[]
    isParent?: boolean
    x?: number
    y?: number
    fx?: number | null
    fy?: number | null
}

type GraphProps = {
    data: Node[]
    handleOnNodeClick: (address: string, isParent: boolean) => void
}

const Graph = ({ data, handleOnNodeClick }: GraphProps) => {
    const ref = useRef<SVGSVGElement>(null)

    const createGraph = useCallback(() => {
        if (!ref.current) return

        const svg = d3.select(ref.current)
        const width = window.innerWidth - 48
        const height = window.innerHeight - 120

        svg.selectAll("*").remove()

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 20)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#999")

        const nodeSpacing = (height / 1.25) / (data.length + 1)
        data.forEach((node, index) => {
            node.x = 100
            node.y = nodeSpacing * (index + 1) + 100
            node.isParent = true
        })

        const allNodes: Node[] = []

        const addSubnodes = (node: Node) => {
            allNodes.push(node)
            if (node.subnodes) {
                node.subnodes.forEach((subnode, subIndex) => {
                    subnode.x = node.x! + 300
                    subnode.y = node.y! + (subIndex - (node.subnodes!.length - 1) / 2) * 20
                    subnode.isParent = false
                    allNodes.push(subnode)
                    addSubnodes(subnode)
                })
            }
        }

        data.forEach(node => {
            addSubnodes(node)
        })

        const simulation = d3.forceSimulation<Node>(allNodes)
            .force("charge", d3.forceManyBody().strength(-10))

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(allNodes.flatMap(node =>
                (node.subnodes || []).map(subnode => ({ source: node, target: subnode }))
            ))
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("marker-end", "url(#arrow)")

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(allNodes)
            .enter().append("circle")
            .attr("r", 15)
            .attr("fill", "purple")
            .call(d3.drag<SVGCircleElement, Node>()
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded))
            .on("click", (event, d) => handleOnNodeClick(d.address, d.isParent ?? false))

        const addressName = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(allNodes)
            .enter().append("text")
            .attr("dx", -30)
            .attr("dy", 30)
            .attr("fill", "white")
            .text(d => d.address_name)

        const address = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(allNodes)
            .enter().append("text")
            .attr("dx", -30)
            .attr("dy", (d => d.address_name ? 50 : 30))
            .attr("fill", "white")
            .text(d => `${d.address.slice(0, 6)}.....${d.address.slice(-5)}`)

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => d.source.x ?? 0)
                .attr("y1", (d) => d.source.y ?? 0)
                .attr("x2", (d) => d.target.x ?? 0)
                .attr("y2", (d) => d.target.y ?? 0)

            node
                .attr("cx", (d: Node) => Math.max(15, Math.min(width - 15, d.x ?? 0)))
                .attr("cy", (d: Node) => Math.max(15, Math.min(height - 15, d.y ?? 0)))


            addressName
                .attr("x", (d: Node) => Math.max(15, Math.min(width - 15, d.x ?? 0)))
                .attr("y", (d: Node) => Math.max(15, Math.min(height - 15, d.y ?? 0)))
            address
                .attr("x", (d: Node) => Math.max(15, Math.min(width - 15, d.x ?? 0)))
                .attr("y", (d: Node) => Math.max(15, Math.min(height - 15, d.y ?? 0)))
        })

        function dragStarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
            if (!event.active) simulation.alphaTarget(0.1).restart()
            d.fx = d.x
            d.fy = d.y
        }

        function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
            d.fx = Math.max(15, Math.min(width - 15, event.x))
            d.fy = Math.max(15, Math.min(height - 15, event.y))
        }

        function dragEnded(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        }
    }, [data, handleOnNodeClick])

    useEffect(() => {
        createGraph()
    }, [createGraph, data])

    return (
        <svg ref={ref} width="100%" height="100%"></svg>
    )
}

export default Graph