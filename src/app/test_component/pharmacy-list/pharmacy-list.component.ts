import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/models/store.model';
import { LoginService } from 'src/app/@services/login.service';

@Component({
  selector: 'app-pharmacy-list',
  templateUrl: './pharmacy-list.component.html',
  styleUrls: ['./pharmacy-list.component.css']
})
export class PharmacyListComponent implements OnInit {
  stores?: Store[];
  currentTutorial?: Store;
  currentIndex = -1;
  title = '';

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.retrievePharmacy();
  }

  retrievePharmacy(): void {
    this.loginService.getAll()
      .subscribe(
        data => {
          this.stores = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrievePharmacy();
    this.currentTutorial = undefined;
    this.currentIndex = -1;
  }

  setActivePharmacy(store: Store, index: number): void {
    this.currentTutorial = store;
    this.currentIndex = index;
  }

  removeAllPharmacy(): void {
    this.loginService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.loginService.findByTitle(this.title)
      .subscribe(
        data => {
          this.stores = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

}