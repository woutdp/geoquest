<script lang="ts">
    import * as d3 from 'd3'
    import _ from 'lodash'
    import {onMount} from 'svelte'
    import {fly} from 'svelte/transition'

    import Country from '$lib/map/Country.svelte'
    import CountryHelper from '$lib/map/CountryHelper.svelte'
    import IslandHelper from '$lib/map/IslandHelper.svelte'
    import {chosenMap, clientX, clientY, geojson, geometries, mousePos, noPanNoZoom, projection} from '$lib/store'

    let transform = d3.zoomIdentity
    $: d3Svg && ($noPanNoZoom ? disableZoom() : enableZoom())
    function disableZoom() {
        d3Svg.call(zoom).on('.zoom', null)
    }
    function enableZoom() {
        d3Svg.call(zoom)
    }

    let svg
    let d3Svg
    let scale = 1
    let t0
    let lastFocusedFeatures

    $: path = getPath(scale * 200)
    $: strokeWidth = 0.2 * scale
    $: mapData = _.zip($geojson.features, $geometries)

    function getPath(s) {
        return d3
            .geoPath()
            .projection({stream: stream => {
                if (t0) return $projection.scale(t0.k).translate([t0.x, t0.y]).stream(stream)
                else return $projection.stream(stream)
            }})
            .pointRadius(0.005 * s)
    }

    function zoomed(e) {
        const t = e.transform
        t.x = Math.min($clientX / 2, Math.max(t.x, $clientX / 2 - $clientX * t.k))
        t.y = Math.min($clientY / 2, Math.max(t.y, $clientY / 2 - $clientY * t.k))
        transform = t
        if (e.sourceEvent) $mousePos = {x: e.sourceEvent.clientX, y: e.sourceEvent.clientY}
    }

    let zoom = d3.zoom().scaleExtent([1, chosenMap.maxZoom || 50]).on('zoom', zoomed).clickDistance(10)

    function centerMap() {

        // (re)set initial translation according to window dimensions
        t0 = {
            k: $clientX / 2 / Math.PI,
            x: $clientX / 2,
            y: $clientY / 2,
        }

        // figure out and apply zoom
        $projection.scale(t0.k).translate([t0.x, t0.y])
        d3Svg.call(zoom)

        path = getPath(scale * 200) // It's important to reset the path, otherwise an height change such as full screen might screw up the map

    }

    function centerMapAndFocus() {
        // reset t0, map scale...
        centerMap()
        // need the timeout because otherwise it messes up the ability to use focusGeometries again, making it focusing in wrong places
        setTimeout(function () { focusGeometries(undefined, true) }, 100);
    }

    export function zoomIn() {
        zoom.scaleBy(d3Svg.transition().duration(200), 1.8)
    }

    export function zoomOut() {
        zoom.scaleBy(d3Svg.transition().duration(200), 1 / 1.8)
    }

    // zoom map around passed features
    export function focusGeometries(features, avoidTransition) {

        // if no feature passed, use whole map
        if (!features) features = lastFocusedFeatures || $geojson

        // support passing an array of features
        if (_.isArray(features)) features = { type: "FeatureCollection", features: features, }

        // save last focused features for reuse on eventual window resize
        lastFocusedFeatures = features

        // fit projection to passed feature(s) (with padding around it to give air to focused shape)
        var padding = 10
        $projection.fitExtent([[padding, padding], [$clientX - padding*2, $clientY - padding*2]], features)
        // map.projection.fitSize([map.t0.width, map.t0.height], features) // without padding

        // figure out zoom to apply (scale and translation)
        let k = $projection.scale() / t0.k
        let x = $projection.translate()[0] - t0.x * k
        let y = $projection.translate()[1] - t0.y * k

        // apply zoom
        if (avoidTransition) d3Svg.call(zoom.transform, d3.zoomIdentity.translate(x,y).scale(k))
        else d3Svg.transition().duration(1500).call(zoom.transform, d3.zoomIdentity.translate(x,y).scale(k))

    }

    onMount(async () => {
        d3Svg = d3.select(svg)
        if ($noPanNoZoom) {
            disableZoom()
        } else {
            enableZoom()
        }

        centerMap()
    })
</script>

<svelte:window on:resize={centerMapAndFocus} />

<svg bind:this={svg} transition:fly|global={{y: 20, duration: 1500}} width={$clientX} height={$clientY} viewBox="0 0 {$clientX} {$clientY}">
    <g shape-rendering="auto" {transform}>
        {#each mapData as data}
            <Country {data} {path} {...$$restProps} />
        {/each}
        {#each mapData as data}
            {#if data[0]?.properties?.helper && data[0]?.properties.type !== "basemap"}
                <CountryHelper {data} {path} {strokeWidth} {...$$restProps} />
            {:else if data[0]?.properties?.isIsland && data[0]?.properties?.squareKm < 30000 && data[0]?.properties.type !== "basemap"}
                <IslandHelper {data} {path} {scale} {strokeWidth} {...$$restProps} />
            {/if}
        {/each}
    </g>
</svg>
