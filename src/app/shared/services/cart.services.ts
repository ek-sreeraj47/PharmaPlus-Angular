// src/app/shared/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export type Id = string | number;

export interface CartItem {
  id: Id;              // supports Mongo _id (string) or numeric id
  name: string;
  price: number;
  img?: string;
}

export interface CartLine {
  item: CartItem;
  qty: number;
}

const STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _lines: CartLine[] = [];
  private _lines$ = new BehaviorSubject<CartLine[]>([]);

  constructor() {
    // hydrate from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this._lines = JSON.parse(raw);
    } catch {}
    this._emit();
  }

  // ---------- helpers ----------
  private save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._lines)); } catch {}
  }
  private _emit() {
    this._lines$.next([...this._lines]);
    this.save();
  }
  private sameId = (a: Id, b: Id) => String(a) === String(b); // unify '1' vs 1

  // ---------- public API (snapshots + streams) ----------
  /** Observable stream for templates: cartService.lines$ | async */
  readonly lines$ = this._lines$.asObservable();

  /** Read-only snapshot array (compat with your current code) */
  lines(): CartLine[] {
    return [...this._lines];
  }

  /** Total distinct lines */
  lineCount(): number {
    return this._lines.length;
  }

  /** Total items (sum of qty) */
  itemCount(): number {
    return this._lines.reduce((n, l) => n + l.qty, 0);
  }

  /** Subtotal amount */
  subtotal(): number {
    return this._lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  }

  /** Subtotal as observable (handy in templates) */
  readonly subtotal$ = this.lines$.pipe(
    map(lines => lines.reduce((s, l) => s + l.item.price * l.qty, 0))
  );

  // ---------- mutations ----------
  add(item: CartItem, qty = 1) {
    const i = this._lines.findIndex(l => this.sameId(l.item.id, item.id));
    if (i >= 0) {
      this._lines[i].qty += qty;
    } else {
      this._lines.push({ item, qty });
    }
    this._emit();
  }

  /** Convenience: add directly from your Product object (mixed keys) */
  addProduct(p: { _id?: string; id?: number; name: string; price: number; img?: string; image?: string }, qty = 1) {
    const item: CartItem = {
      id: (p._id ?? p.id)!,
      name: p.name,
      price: p.price,
      img: p.img ?? p.image
    };
    this.add(item, qty);
  }

  setQty(id: Id, qty: number) {
    const i = this._lines.findIndex(l => this.sameId(l.item.id, id));
    if (i >= 0) {
      this._lines[i].qty = Math.max(1, qty);
      this._emit();
    }
  }

  increment(id: Id) {
    const i = this._lines.findIndex(l => this.sameId(l.item.id, id));
    if (i >= 0) { this._lines[i].qty++; this._emit(); }
  }

  decrement(id: Id) {
    const i = this._lines.findIndex(l => this.sameId(l.item.id, id));
    if (i >= 0) {
      this._lines[i].qty = Math.max(1, this._lines[i].qty - 1);
      this._emit();
    }
  }

  remove(id: Id) {
    this._lines = this._lines.filter(l => !this.sameId(l.item.id, id));
    this._emit();
  }

  clear() {
    this._lines = [];
    this._emit();
  }
}
