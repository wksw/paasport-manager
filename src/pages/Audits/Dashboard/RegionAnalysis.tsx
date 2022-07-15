import Earth from "@/thirdparty/3d-earth/src";
import { City } from "@/thirdparty/3d-earth/src/types";
import { GetRegionAnalysis } from "@/services/paasport/audit/v2/audit_v2_umirequest";
import React, { useEffect } from "react";

const RegionAnalysis: React.FC = () => {
    useEffect(() => {
        const getRegionAnalysis = async () => {
            const resp = await GetRegionAnalysis({ sort: 'total_counts' })
            var regions: City[] = []
            for (const region of resp.data[0].data) {
                regions.push({
                    name: `${region.country}-${region.city}`,
                    longitude: region.lng,
                    latitude: region.lat,
                    value: region.total_counts,
                })
            }
            let e = new Earth("region_analysis", regions, [], {
                earthRadius: 12,
                autoRotate: true,
                zoomChina: false,
                starBackground: true,
                orbitControlConfig: {
                    enableZoom: true,
                    enableRotate: true,
                }
            });
            e.load()
        }
        getRegionAnalysis()
    }, [])

    return (
        <div id='region_analysis' style={{ width: "100%", height: "100vh", backgroundColor: '#0b0e15' }} />
    );
}

export default RegionAnalysis;
