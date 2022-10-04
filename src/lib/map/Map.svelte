<script lang="ts">
    import * as d3 from 'd3'
    import _ from 'lodash'
    import {onMount} from 'svelte'
    import {fly} from 'svelte/transition'

    import Country from '$lib/map/Country.svelte'
    import CountryHelper from '$lib/map/CountryHelper.svelte'
    import IslandHelper from '$lib/map/IslandHelper.svelte'
    import {clientX, clientY, geojson, mousePos, projection, topojson} from '$lib/store'

    let transform = d3.zoomIdentity
    let svg
    let d3Svg
    let scale = 1

    $: path = getPath(scale)
    $: strokeWidth = 0.002 * scale
    $: mapData = _.zip($geojson.features, Object.values($topojson.objects)[0].geometries)
    $: bounds = d3
        .geoPath()
        .projection($projection.scale(1).translate([0, 0]).rotate([-11, 0]))
        .bounds($geojson)

    function getPath(s) {
        return d3
            .geoPath()
            .projection({stream: stream => $projection.stream(stream)})
            .pointRadius(0.01 * s)
    }

    function zoomed(e) {
        const t = e.transform
        t.x = Math.min($clientX / 2, Math.max(t.x, $clientX / 2 - $clientX * t.k))
        t.y = Math.min($clientY / 2, Math.max(t.y, $clientY / 2 - $clientY * t.k))
        transform = t
        if (e.sourceEvent) $mousePos = {x: e.sourceEvent.clientX, y: e.sourceEvent.clientY}
    }

    let zoom = d3.zoom().scaleExtent([1, 50]).on('zoom', zoomed).clickDistance(10)

    function centerMap() {
        scale = 0.95 / Math.max((bounds[1][0] - bounds[0][0]) / $clientX, (bounds[1][1] - bounds[0][1]) / $clientY)
        $projection.scale(scale).translate([($clientX - scale * (bounds[1][0] + bounds[0][0])) / 2, ($clientY - scale * (bounds[1][1] + bounds[0][1])) / 2])
        path = getPath(scale) // It's important to reset the path, otherwise an height change such as full screen might screw up the map

        if ($clientX < 800) d3Svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    }

    export function zoomIn() {
        zoom.scaleBy(d3Svg.transition().duration(200), 1.8)
    }

    export function zoomOut() {
        zoom.scaleBy(d3Svg.transition().duration(200), 1 / 1.8)
    }

    onMount(async () => {
        d3Svg = d3.select(svg)
        d3Svg.call(zoom)

        centerMap()
    })
</script>

<svelte:window on:resize={centerMap} />

<svg bind:this={svg} transition:fly={{y: 20, duration: 1500}} width={$clientX} height={$clientY} viewBox="0 0 {$clientX} {$clientY}">
    <g shape-rendering="auto" {transform}>
        {#each mapData as data}
            <Country {data} {path} {...$$restProps} />
        {/each}
        {#each mapData as data}
            {#if data[0]?.properties?.helper}
                <CountryHelper {data} {path} {strokeWidth} {...$$restProps} />
            {:else if data[0]?.properties?.isIsland && data[0]?.properties?.squareKm < 30000}
                <IslandHelper {data} {path} {scale} {strokeWidth} {...$$restProps} />
            {/if}
        {/each}
    </g>
</svg>
