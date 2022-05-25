import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBA';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  
  public token : any= '';
  public url = GLOBAL.url;
  public reviews : Array<any>=[];
  public load_data = true;

  public page = 1;
  public pageSize = 15;

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.src= 'assets/js/main.js';
    head.appendChild(script);
    this._guestService.obtener_reviews_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        console.log(response);
        this.reviews = response.data;
        this.load_data = false;
      }
    );;
  }

}
