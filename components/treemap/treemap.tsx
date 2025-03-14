import * as d3 from "d3"

import { useEffect, useRef } from "react"

interface DataInterface {
    name: string
    market_cap: number
    market_cap_change_24h: number
    top_3_coins: string[]
}

type TreeMapProps = {
    data: DataInterface[]
}

export const TreeMap = ({ data }: TreeMapProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const width = window.innerWidth - 48
        const height = window.innerHeight - 120

        d3.select(ref.current).selectAll("*").remove()

        const svg = d3.select(ref.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        const root = d3.hierarchy<{ children: DataInterface[] }>({ children: data })
            .sum(d => d.children ? 0 : (d as unknown as DataInterface).market_cap)
            .sort((a, b) => b.value! - a.value!)

        const treemapLayout = d3.treemap<{ children: DataInterface[] }>()
            .size([width, height])
            .padding(1)

        treemapLayout(root)

        const nodes = svg.selectAll('g')
            .data(root.leaves())
            .enter()
            .append('g')
            .attr('transform', d => `translate(${(d as d3.HierarchyRectangularNode<{ children: DataInterface[] }>).x0},${(d as d3.HierarchyRectangularNode<{ children: DataInterface[] }>).y0})`)

        nodes.append('rect')
            .attr('width', d => (d as d3.HierarchyRectangularNode<{ children: DataInterface[] }>).x1 - (d as d3.HierarchyRectangularNode<{ children: DataInterface[] }>).x0)
            .attr('height', d => (d as d3.HierarchyRectangularNode<{ children: DataInterface[] }>).y1 - (d as d3.HierarchyRectangularNode<{ children: DataInterface[] }>).y0)
            .attr('fill', d => (d.data as unknown as DataInterface).market_cap_change_24h > 0 ? '#5CB338' : '#FB4141')
            .on('mouseover', function (event, d) {
                d3.select('#tooltip')
                    .style('display', 'flex')
                    .html((d.data as unknown as DataInterface).top_3_coins.map(coin => `<img src="${coin}" width="40" height="40" />`).join(' '))
            })
            .on('mousemove', function (event) {
                const tooltip = d3.select('#tooltip')
                const tooltipWidth = 168
                const tooltipHeight = 72
                const pageWidth = window.innerWidth
                const pageHeight = window.innerHeight

                let left = event.pageX + 10
                let top = event.pageY + 10

                if (event.pageX + tooltipWidth + 12 > pageWidth) {
                    left = event.pageX - tooltipWidth - 10
                }

                if (event.pageY + tooltipHeight + 12 > pageHeight) {
                    top = event.pageY - tooltipHeight - 10
                }

                tooltip
                    .style('left', `${left}px`)
                    .style('top', `${top}px`)
            })
            .on('mouseout', function () {
                d3.select('#tooltip').style('display', 'none')
            })

        nodes.append('text')
            .attr('dx', 4)
            .attr('dy', 20)
            .text(d => (d.data as unknown as DataInterface).name)
            .on('mouseover', function (event, d) {
                d3.select('#tooltip')
                    .style('display', 'flex')
                    .html((d.data as unknown as DataInterface).top_3_coins.map(coin => `<img src="${coin}" width="40" height="40" />`).join(' '))
            })
            .on('mousemove', function (event) {
                const tooltip = d3.select('#tooltip')
                const tooltipWidth = 168
                const tooltipHeight = 72
                const pageWidth = window.innerWidth
                const pageHeight = window.innerHeight

                let left = event.pageX + 10
                let top = event.pageY + 10

                if (event.pageX + tooltipWidth + 12 > pageWidth) {
                    left = event.pageX - tooltipWidth - 10
                }

                if (event.pageY + tooltipHeight + 12 > pageHeight) {
                    top = event.pageY - tooltipHeight - 10
                }

                tooltip
                    .style('left', `${left}px`)
                    .style('top', `${top}px`)
            })
            .on('mouseout', function () {
                d3.select('#tooltip').style('display', 'none')
            })
    }, [data])

    return (
        <div>
            <div ref={ref} />
            <div id="tooltip" className="absolute gap-x-3 p-3 rounded-xl bg-black pointer-events-none" />
        </div>
    )
}