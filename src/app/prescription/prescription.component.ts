import { Component, NgZone, ViewChild, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent {
  // autocomplete: any;
  // placesService: any;
  // @ViewChild('autocomplete') autocompleteRef!: ElementRef;
  // constructor(private ngZone: NgZone) {
  //   this.autocomplete = null;
  //   this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  // }
  // ngOnInit() {
  //   console.log(this.autocompleteRef)
  //     this.autocomplete = new google.maps.places.Autocomplete(
  //       this.autocompleteRef.nativeElement,
  //       {
  //         types: ['geocode']
  //       },
  //     );
    
  
  //   this.autocomplete.addListener('place_changed', () => {
  //     this.ngZone.run(() => {
  //       const place = this.autocomplete.getPlace();
  //       if (place.geometry) {
  //         this.searchNearbyPlaces(place.geometry.location);
  //       }
  //     });
  //   });
  // }
  
  // searchNearbyPlaces(location: google.maps.LatLng) {
  //   const request = {
  //     location: location,
  //     radius: 1000, // 设置搜索半径，单位为米
  //     type: ['tourist_attraction'] // 指定要搜索的类型，例如'tourist_attraction'表示景点
  //   };
  
  //   this.placesService.nearbySearch(request, (results: any, status: any) => {
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       // 处理搜索结果
  //       console.log(results);
  //     }
  //   });
  // }
}
