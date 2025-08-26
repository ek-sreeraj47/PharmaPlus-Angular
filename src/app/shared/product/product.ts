// src/app/shared/product/product.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { Product as ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.services';
import { CartService } from '../services/cart.services';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.html',
  styleUrls: ['./product.scss']
})
export class FeaturedProducts {
  private products = inject(ProductService);
  private cart = inject(CartService);
  private router = inject(Router);

  // Backend returns Observable<Product[]>
  // Use async pipe in template: *ngFor="let p of (items$ | async)"
  items$ = this.products.featured();

  addToCart(p: ProductModel) {
    this.cart.addProduct(p, 1);  // supports _id | id, img | image
  }

  buyNow(p: ProductModel) {
    this.cart.addProduct(p, 1);
    this.router.navigate(['/checkout']);
  }
}
