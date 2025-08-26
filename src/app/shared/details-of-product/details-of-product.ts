// src/app/shared/details-of-product/details-of-product.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, map, of, catchError } from 'rxjs';

import { Product } from '../models/product.model';
import { ProductService } from '../services/product.services';   // ✅ singular
import { CartService } from '../services/cart.services';         // ✅ singular

@Component({
  selector: 'app-details-of-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-of-product.html',
  styleUrls: ['./details-of-product.scss']
})
export class DetailsOfProduct {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private products = inject(ProductService);
  private cartSvc = inject(CartService);

  product?: Product;
  loading = true;
  error = '';

  ngOnInit() {
    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id),
      switchMap(id => {
        const isMongoId = /^[a-f0-9]{24}$/i.test(id);

        if (isMongoId) {
          return this.products.getByMongoId(id).pipe(
            catchError(err => {
              this.error = 'Product not found';
              console.error(err);
              return of(undefined);
            })
          );
        } else {
          const num = Number(id);
          if (!Number.isFinite(num)) return of(undefined);
          return this.products.all().pipe(
            map(list => list.find(p => p.id === num)),
            catchError(err => {
              this.error = 'Product not found';
              console.error(err);
              return of(undefined);
            })
          );
        }
      })
    ).subscribe(p => {
      this.product = p;
      this.loading = false;
      if (!p && !this.error) this.error = 'Product not found';
    });
  }

  addToCart() {
    if (this.product) this.cartSvc.addProduct(this.product, 1); // ✅
  }

  buyNow() {
    if (!this.product) return;
    this.cartSvc.addProduct(this.product, 1);                   // ✅
    this.router.navigate(['/checkout']);
  }
}
