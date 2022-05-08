import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

import {circle, latLng, polygon, tileLayer, imageOverlay} from "leaflet";

import * as L from "leaflet";
import {Field} from "../../models/field";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @Input() field!: Field;

  map: any;
  options: any;
  layersControl: any;
  zoom = 15;

  imageUrl!: string;

  imageBounds: L.LatLngBoundsExpression = [];
  overlaysGroup = L.layerGroup();


  constructor() {}

  ngOnInit(): void {
    this.options = {
      layers: [
        tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA`,
          { maxZoom: 18, attribution: '...' })
      ],
      zoom: 13,
      center: latLng(this.field.coordinateList[0].latitude, this.field.coordinateList[0].longitude),
    };
    this.layersControl = {
      baseLayers: {
        'MapBox': tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: '..',
          maxZoom: 18,

          id: 'mapbox/satellite-v9',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA',
        }),
        'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      },
      overlays: {
        overlays: this.overlaysGroup
      }
    }
  }

  ngAfterViewInit(): void {}

  onMapReady(): void {
    this.imageBounds = [];
    for (const coordinate of this.field.coordinateList) {
      this.imageBounds.push(
        [coordinate.latitude, coordinate.longitude]
      )
    }
    // map.fitBounds(this.imageOverlay.getBounds());
    imageOverlay(<string>this.field.ndviDataList.pop()?.imageUrl, this.imageBounds).addTo(this.overlaysGroup)
  }

}
