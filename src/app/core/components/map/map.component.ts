import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { latLng, tileLayer, imageOverlay, FeatureGroup, featureGroup, control } from "leaflet";

import * as L from "leaflet";
import * as Draw from 'leaflet-draw'
import { Field, NdviData } from "../../models/field";
import { Observable, Subscription } from "rxjs";
import { ApiService } from "../../services/api.service";
import { UtilsService } from "../../services/utils.service";
import layers = control.layers;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() field!: Field;
  @Input() draw!: boolean;
  @Input() events!: Observable<void>;
  @Input() onMapChange!: Observable<void>;
  @Output() onFieldCreate = new EventEmitter<any>();

  private eventsSubscription!: Subscription;
  private onMapChangeSubscription!: Subscription;

  options: any;
  layersControl: any;
  zoom = 15;

  map: any;

  imageUrl!: string;

  imageBounds: L.LatLngBoundsExpression = [];
  overlaysGroup = L.layerGroup();


  drawnItems: FeatureGroup = featureGroup();

  drawOptions = {
    edit: undefined,
    draw: undefined,
  };


  constructor(private apiService: ApiService,
              private utilsService: UtilsService) {
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

    if (this.events) {
      this.eventsSubscription = this.events.subscribe((event: any) => this.updateMap(event));
    }

    if (this.onMapChange) {
      this.onMapChangeSubscription = this.onMapChange.subscribe((field: any) => this.changeMap(field));
    }
  }

  changeMap(field: Field): void {
    this.field = field;
    this.ngOnInit();
    this.onMapReady(this.map);
    // this.layersControl.p
  }

  updateMap(event: NdviData): void {
    this.addImageToMap(event);
  }

  ngAfterViewInit(): void {
  }

  addImageToMap(ndviData: NdviData): void {
    // map.fitBounds(this.imageOverlay.getBounds());

    if (ndviData) {
      this.utilsService.loading = true;
      this.apiService.getNDVIImageById(ndviData.ndviDataId)
        .subscribe(
          (data) => {
            this.layersControl.overlays.overlays.clearLayers();
            imageOverlay(<string>this.utilsService.getImageUrlFromBlobResponse(data), this.imageBounds).addTo(this.overlaysGroup);
            this.layersControl.overlays.overlays.addTo(this.map);
          },
          (error) => {
            this.utilsService.errorMessage();
            console.error(error);
          }
        ).add(() => this.utilsService.loading = false)
    }
  }

  onMapReady(map: any): void {
    this.layersControl.baseLayers.MapBox.addTo(map);
    this.map = map;

    if (!this.draw) {
      const coordinates = this.utilsService.getPolygonLatLngs(this.field.coordinateList);
      this.imageBounds = coordinates;
      // @ts-ignore
      this.addImageToMap(this.field.ndviDataList.pop());

      this.map.eachLayer((layer: any) => {
        if (layer._path != null || layer._layers) {
          layer.remove()
        }
      })
      if (!this.field.ndviDataList || this.field.ndviDataList.length === 0) {
        // this.map.each
        L.polygon(coordinates, {
          color: 'blue',
          opacity: 0.5
        }).addTo(this.map);
      }
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

  ngOnDestroy() {
    this.eventsSubscription?.unsubscribe();
  }
}
