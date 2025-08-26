// src/app/shared/shop/shop.ts
import { Component, computed, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product } from '../models/product.model';
import { ProductService } from '../services/product.services';
import { CartService } from '../services/cart.services';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './shop.html',
  styleUrls: ['./shop.scss']
})
export class Shop {
  // services
  private productSvc = inject(ProductService);
  private cartSvc = inject(CartService);
  private destroyRef = inject(DestroyRef);

  // backend data held in a signal
  products = signal<Product[]>([]);

  // ---- ui state ----
  q    = signal<string>('');
  cat  = signal<string>('All');
  sort = signal<string>('reco'); // reco | price_low | price_high | name
  page = signal<number>(1);
  size = 8;

  constructor() {
    // Load from backend once; auto-unsubscribe on destroy
    this.productSvc
      .all()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: list => this.products.set(list ?? []),
        error: err => console.error('Failed to load products', err)
      });
  }

  // categories derived from products
  cats = computed(() => {
    const list = this.products();
    const set = new Set(list.map(x => x.cat ?? (x as any).category ?? ''));
    return ['All', ...Array.from(set).filter(Boolean)];
  });

  // filter/sort
  filtered = computed<Product[]>(() => {
    const list = this.products();
    let out: Product[] = list;

    // search
    const look = this.q().trim().toLowerCase();
    if (look) {
      out = out.filter(p => {
        const name = (p.name ?? '').toLowerCase();
        const cat  = (p.cat ?? (p as any).category ?? '').toLowerCase();
        return name.includes(look) || cat.includes(look);
      });
    }

    // category
    if (this.cat() !== 'All') {
      out = out.filter(p => (p.cat ?? (p as any).category) === this.cat());
    }

    // sort
    switch (this.sort()) {
      case 'price_low':
        out = [...out].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price_high':
        out = [...out].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name':
        out = [...out].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
        break;
      default:
        // reco: keep backend order
        break;
    }

    return out;
  });

  // pagination
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.size))
  );

  pageItems = computed(() => {
    const p = this.page();
    const start = (p - 1) * this.size;
    return this.filtered().slice(start, start + this.size);
  });

  // actions
  setCat(v: string)  { this.cat.set(v);  this.page.set(1); }
  setSort(v: string) { this.sort.set(v); this.page.set(1); }
  setPage(v: number) {
    const t = this.totalPages();
    this.page.set(Math.min(Math.max(1, v), t));
  }

  // add to cart (works with _id or id, img or image)
  add(p: Product) {
    this.cartSvc.addProduct(p, 1);
  }

  // Optional: for *ngFor trackBy
  trackById = (_: number, p: Product) => String((p as any)._id ?? p.id);
}
