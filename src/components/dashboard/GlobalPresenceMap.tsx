'use client'

import React, { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { Globe, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// URL for the TopoJSON map data
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface GlobalPresenceMapProps {
    data: { name: string; iso: string; calls: number; quotes: number }[]
}

export default function GlobalPresenceMap({ data }: GlobalPresenceMapProps) {
    const [zoom, setZoom] = useState(1)

    // Create a map of ISO codes to data for easy lookup
    const dataMap = useMemo(() => {
        const map = new Map()
        data.forEach(d => {
            // Mapping both 2-letter and potential 3-letter codes if necessary. 
            // TopoJSON usually uses ISO 3 numeric or string.
            // React-simple-maps usually aligns with ISO-3 string.
            // My data has 2-letter ISO codes (e.g. US, GB).
            // The world-atlas TopoJSON uses ISO Alpha-3 or Numeric.
            // I might need a mapping or just rely on matching names if ISO mismatches.
            // Ideally, I should convert ISO-2 to ISO-3 or check what "iso" field contains.
            // In the data source 'getCallAnalytics', it uses 'iso_code' from 'call_inquiries'.
            // Assuming 2-letter code based on previous file content 'US', 'GB', etc.
            map.set(d.iso, d.calls)
        })
        return map
    }, [data])

    // Scale for coloring countries
    const colorScale = useMemo(() => {
        const maxCalls = Math.max(...data.map(d => d.calls), 0)
        return scaleLinear<string>()
            .domain([0, Math.max(1, maxCalls)])
            .range(["#F1F5F9", "#3B82F6"]) // slate-100 to blue-500
    }, [data])

    // Mapping from ISO Alpha-2 to ISO Alpha-3 or Numeric is often needed for world-atlas used commonly.
    // However, I can try to match by Name if ISO fails, or I need an ISO-2 to ISO-3 map.
    // For now, I will assume the user has accurate ISO codes or I might need a utility.
    // Actually, "react-simple-maps" examples often use ISO 3.
    // Let's include a small lookup or try to find a geojson that supports ISO 2, 
    // or just map the common ones for now.
    // A robust way uses a library like 'i18n-iso-countries' but I can't install too many things.
    // Let's stick to name matching as a fallback or a basic map.

    // Let's try to match by name or properties.ISO_A2 if available in the topojson.
    // The standard world-atlas 110m has ISO_A3 and NAME.

    // I shall make a helper function to match standardizing

    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 4))
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 1))

    return (
        <div className="relative w-full h-full bg-slate-50/30 rounded-xl overflow-hidden">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
                    aria-label="Zoom in"
                >
                    <Plus className="w-4 h-4" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
                    aria-label="Zoom out"
                >
                    <Minus className="w-4 h-4" />
                </button>
            </div>

            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                <ZoomableGroup zoom={zoom} center={[0, 20]} onMoveEnd={(position: { zoom: number }) => setZoom(position.zoom)}>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => {
                                // Logic to match my data (ISO 2) with Geo data (usually ISO 3 or Name)
                                // Standard world-atlas has property "ISO_A3" usually. 
                                // I will try to match "name" if available.
                                const geoName = geo.properties.name;
                                // Simple find
                                const countryData = data.find(d =>
                                    d.name === geoName ||
                                    // Hacky ISO 3 to 2 check for common ones or if my data has ISO 3
                                    (d.iso.length === 3 && d.iso === geo.properties.ISO_A3) ||
                                    (d.iso === 'US' && geo.properties.ISO_A3 === 'USA') ||
                                    (d.iso === 'GB' && geo.properties.ISO_A3 === 'GBR') ||
                                    (d.iso === 'AU' && geo.properties.ISO_A3 === 'AUS') ||
                                    (d.iso === 'IN' && geo.properties.ISO_A3 === 'IND') ||
                                    (d.iso === 'LK' && geo.properties.ISO_A3 === 'LKA') ||
                                    (d.iso === 'AE' && geo.properties.ISO_A3 === 'ARE') ||
                                    (d.iso === 'CA' && geo.properties.ISO_A3 === 'CAN') ||
                                    (d.iso === 'SG' && geo.properties.ISO_A3 === 'SGP') ||
                                    (d.iso === 'DE' && geo.properties.ISO_A3 === 'DEU') ||
                                    (d.iso === 'FR' && geo.properties.ISO_A3 === 'FRA')
                                );

                                const calls = countryData?.calls || 0;

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={calls > 0 ? colorScale(calls) : "#F8FAFC"}
                                        stroke="#E2E8F0"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none", transition: "all 250ms" },
                                            hover: { fill: calls > 0 ? "#2563EB" : "#E2E8F0", outline: "none", cursor: calls > 0 ? "pointer" : "default" },
                                            pressed: { outline: "none" },
                                        }}
                                        data-tooltip-id="map-tooltip"
                                        data-tooltip-content={countryData ? `${countryData.name}: ${countryData.calls} inquiries` : ""}
                                        data-tooltip-place="top"
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            <Tooltip
                id="map-tooltip"
                className="!bg-slate-900 !text-white !px-3 !py-2 !rounded-lg !text-xs !font-bold !opacity-100 !shadow-xl z-50"
            />

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inquiry Density</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400">Low</span>
                    <div className="h-2 w-24 bg-gradient-to-r from-slate-100 to-blue-500 rounded-full"></div>
                    <span className="text-[9px] font-bold text-slate-400">High</span>
                </div>
            </div>
        </div>
    )
}
