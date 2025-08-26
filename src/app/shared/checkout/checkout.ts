// src/app/shared/checkout/checkout.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartLine } from '../services/cart.services';

type CartItemView = {
  name: string;
  price: number;
  qty: number;
  cat: string;
  img: string;
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class Checkout {
  private cart = inject(CartService);

  // UI state
  coupon = '';
  shipMethod: 'standard' | 'express' = 'standard';
  payMethod: 'card' | 'upi' | 'cod' = 'card';

  // pricing state
  private discount = 0;          // keep discount separate from subtotal
  subtotal = 0;                  // items total after discount
  tax = 0;
  shipping = 0;
  total = 0;

  constructor() {
    this.calculate();            // initial totals
  }

  /** Map CartService lines to what the template expects */
  get items(): CartItemView[] {
    const lines: CartLine[] = this.cart.lines();
    return lines.map(l => ({
      name: (l.item as any).name ?? (l.item as any).title ?? '',
      price: Number((l.item as any).price) || 0,
      qty: l.qty,
      cat: (l.item as any).category ?? (l.item as any).cat ?? '',
      img: (l.item as any).img ?? (l.item as any).image ?? ''
    }));
  }

  get shippingLabel() {
    return this.shipMethod === 'standard' ? 'Free' : `₹${this.shipping}`;
  }

  /** Recalculate all totals based on current cart + UI state */
  private calculate() {
    const baseSubtotal = this.cart.subtotal();        // number from service
    this.shipping = this.shipMethod === 'express' ? 199 : 0;

    const discounted = Math.max(0, baseSubtotal - this.discount);
    this.subtotal = Math.round(discounted);
    this.tax = Math.round(this.subtotal * 0.04);      // demo 4% tax
    this.total = this.subtotal + this.shipping + this.tax;
  }

  updateTotals() {
    this.calculate();
  }

  applyCoupon() {
    const code = this.coupon.trim().toUpperCase();
    if (code === 'SAVE50') {
      this.discount = 50;          // flat ₹50 off demo
      this.calculate();
      alert('Coupon applied: ₹50 OFF');
    } else if (code) {
      alert('Invalid coupon');
    }
  }

  placeOrder() {
    // Build order payload from live cart
    const order = {
      lines: this.cart.lines().map(l => ({
        id: (l.item as any).id,
        name: (l.item as any).name ?? (l.item as any).title ?? '',
        price: Number((l.item as any).price) || 0,
        qty: l.qty,
      })),
      shippingMethod: this.shipMethod,
      paymentMethod: this.payMethod,
      totals: {
        discount: this.discount,
        subtotal: this.subtotal,
        shipping: this.shipping,
        tax: this.tax,
        total: this.total,
      },
    };

    console.log('Placing order with data:', order);
    alert('Order placed! (Demo)');
  }
}
