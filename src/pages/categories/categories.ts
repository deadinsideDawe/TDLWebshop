import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories {
  // Kategoria lista, ami a products oldalra szurten navigal.
  categories = [
    'Futes',
    'Hutes',
    'Viz',
    'Szellozes',
    'Szerelvenyek',
    'Lakossagi megoldasok'
  ];
}
