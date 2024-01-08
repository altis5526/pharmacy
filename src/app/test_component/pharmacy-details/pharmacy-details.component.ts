import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/@services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/models/store.model';

@Component({
  selector: 'app-pharmacy-details',
  templateUrl: './pharmacy-details.component.html',
  styleUrls: ['./pharmacy-details.component.css']
})

export class PharmacyDetailsComponent implements OnInit {
  currentStore: Store = {
    title: '',
    description: '',
    published: false
  };
  message = '';

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getPharmacy(this.route.snapshot.params["id"]);
  }

  getPharmacy(id: string): void {
    this.loginService.get(id)
      .subscribe(
        data => {
          this.currentStore = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentStore.title,
      description: this.currentStore.description,
      published: status
    };

    this.loginService.update(this.currentStore.id, data)
      .subscribe(
        response => {
          this.currentStore.published = status;
          console.log(response);
          this.message = response.message;
        },
        error => {
          console.log(error);
        });
  }

  updatePharmacy(): void {
    this.loginService.update(this.currentStore.id, this.currentStore)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message;
        },
        error => {
          console.log(error);
        });
  }

  deletePharmacy(): void {
    this.loginService.delete(this.currentStore.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/tutorials']);
        },
        error => {
          console.log(error);
        });
  }
}