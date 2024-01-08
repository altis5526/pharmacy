import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/models/store.model';
import { LoginService } from 'src/app/@services/login.service';

@Component({
  selector: 'app-add-pharmacy',
  templateUrl: './add-pharmacy.component.html',
  styleUrls: ['./add-pharmacy.component.css']
})
export class AddPharmacyComponent implements OnInit {
    store: Store = {
    title: '',
    description: '',
    published: false
  };
  submitted = false;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  savePharmacy(): void {
    const data = {
      title: this.store.title,
      description: this.store.description
    };

    this.loginService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newPharmacy(): void {
    this.submitted = false;
    this.store = {
      title: '',
      description: '',
      published: false
    };
  }

}