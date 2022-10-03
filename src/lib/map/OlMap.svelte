<script>
    import {asArray} from 'ol/color'
    import { wrapX } from 'ol/coordinate'
    import TopoJSON from 'ol/format/TopoJSON'
    import {Vector} from 'ol/layer'
    import Layer from 'ol/layer/Layer'
    import TileLayer from 'ol/layer/Tile'
    import Map from 'ol/Map'
    import {packColor} from 'ol/renderer/webgl/shaders'
    import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer'
    import VectorSource from 'ol/source/Vector'
    import {Fill, Stroke, Style} from 'ol/style'
    import View from 'ol/View'
    import {transform} from 'ol/proj';

    export let topojson

    let id = 'map'
    let map = null

    class WebGLLayer extends Layer {
        createRenderer() {
            return new WebGLVectorLayerRenderer(this, {
                fill: {
                    attributes: {
                        color: function (feature) {
                            const color = asArray(feature.get('COLOR') || '#eee')
                            color[3] = 0.85
                            return packColor(color)
                        },
                        opacity: function () {
                            return 0.6
                        }
                    }
                },
                stroke: {
                    attributes: {
                        color: function (feature) {
                            const color = [...asArray(feature.get('COLOR') || '#eee')]
                            color.forEach((_, i) => (color[i] = Math.round(color[i] * 0.75))) // darken slightly
                            return packColor(color)
                        },
                        width: function () {
                            return 1
                        },
                        opacity: function () {
                            return 1
                        }
                    }
                }
            })
        }
    }

    var features = new TopoJSON({layers: ['countries']}).readFeatures(topojson,{
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    var source = new VectorSource({
      features: features,
      overlaps: true,
      wrapX: false
    });

    console.log(source)
    console.log(topojson)

    const setupMap = (_node, _id) => {
        const vector = new WebGLLayer({source})
        map = new Map({
            target: id,
            layers: [vector],
            view: new View({
                center: transform([11, 50], 'EPSG:4326', 'EPSG:4326'),
                zoom: 6,
                // projection: 'EPSG:4326'
            })
        })
        return {
            destroy() {
                if (map) {
                    map.setTarget(null)
                    map = null
                }
            }
        }
    }
</script>

<div {id} class="w-screen h-screen" use:setupMap />
