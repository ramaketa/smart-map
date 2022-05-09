import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {latLng, tileLayer, imageOverlay, FeatureGroup, featureGroup} from "leaflet";

import * as L from "leaflet";
import * as Draw from 'leaflet-draw'
import {Field} from "../../models/field";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @Input() field!: Field;
  @Input() draw!: boolean;
  @Output() onFieldCreate = new EventEmitter<any>();

  options: any;
  layersControl: any;
  zoom = 15;

  imageUrl!: string;

  imageBounds: L.LatLngBoundsExpression = [];
  overlaysGroup = L.layerGroup();


  drawnItems: FeatureGroup = featureGroup();

  drawOptions = {
    edit: undefined,
    draw: undefined,
  };


  constructor() {
  }

  ngOnInit(): void {
    const fieldOptions = {
      latitude: this.field?.coordinateList[0].latitude || 48.7194,
      longitude: this.field?.coordinateList[0].longitude || 44.5018,
    }
    this.options = {
      layers: [
        tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA`,
          {maxZoom: 18, attribution: '...'})
      ],
      zoom: 13,
      center: latLng(
        fieldOptions.latitude,
        fieldOptions.longitude),
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
      },
      overlays: {
        overlays: this.overlaysGroup
      }
    }
  }

  ngAfterViewInit(): void {
  }

  onMapReady(map: any): void {
    this.layersControl.baseLayers.MapBox.addTo(map)

    this.imageBounds = [];

    if (!this.draw) {

      for (const coordinate of this.field.coordinateList) {
        this.imageBounds.push(
          [coordinate.latitude, coordinate.longitude]
        )
      }
      // map.fitBounds(this.imageOverlay.getBounds());
      imageOverlay(<string>this.field.ndviDataList.pop()?.imageUrl, this.imageBounds).addTo(this.overlaysGroup)
      this.layersControl.overlays.overlays.addTo(map);
    }

    if (this.draw) {
      // @ts-ignore
      this.drawOptions.edit = {
        featureGroup: this.drawnItems
      }
      // @ts-ignore
      this.drawOptions.draw = {
        polyline: undefined,
        rectangle: undefined,
        circle: undefined,
        marker: undefined,
        circlemarker: undefined,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#b00b00',
            timeout: 1000
          },
          shapeOptions: {
            color: '#bada55'
          },

        },
      }
    }
  }

  public onDrawCreated(e: any) {
    this.onFieldCreate.emit(e.layer.editing.latlngs[0]);
    this.drawnItems.addLayer((e).layer);
  }
}
