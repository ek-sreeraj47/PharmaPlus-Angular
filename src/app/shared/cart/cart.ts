// src/app/shared/cart/cart.ts
import { Component, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService, CartLine } from '../services/cart.services';

type Id = string | number;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink, RouterLinkActive],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart {
  private svc = inject(CartService);

  // expose service for template calls like {{ cart.subtotal() }}
  public cart = this.svc;

  delivery = 40;

  // expose a plain array so *ngFor works
  get lines(): CartLine[] {
    return this.svc.lines();
  }

  // numeric getters to avoid NaN
  get subtotal(): number {
    return this.svc.subtotal(); // ensure CartService.subtotal() returns number
  }

  get total(): number {
    return this.subtotal + this.delivery;
  }

  inc(id: Id) { this.svc.increment(id); }
  dec(id: Id) { this.svc.decrement(id); }
  setQty(id: Id, v: string | number) {
    const qty = Math.max(1, Number(v) || 1);
    this.svc.setQty(id, qty);
  }
  remove(id: Id) { this.svc.remove(id); }
  clear() { this.svc.clear(); }

  trackById = (_: number, l: CartLine) => String(l.item.id);
}
