import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // '' if you use Angular proxy; else 'http://localhost:5000'
  private readonly base = '';

  constructor(private http: HttpClient) {}

  private normalize(p: any): Product {
    // unify keys: img/cat/desc
    let img = p.img ?? p.image ?? null;
    if (img?.startsWith('/images/')) {
      // if you don’t proxy /images, prepend your api base:
      // img = `http://localhost:5000${img}`;
    }
    return {
      ...p,
      img,
      cat: p.cat ?? p.category ?? null,
      desc: p.desc ?? p.description ?? null,
    } as Product;
  }

  /** Safely extract list from array or {items:[]} */
  private extractList = (res: any): any[] =>
    Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : [];

  /** All products */
  all(): Observable<Product[]> {
    return this.http.get<any>(`${this.base}/api/products`).pipe(
      map(this.extractList),
      map(list => list.map(p => this.normalize(p))),
      shareReplay(1)
    );
  }

  /** Featured products */
  featured(): Observable<Product[]> {
    const params = new HttpParams().set('featured', 'true');
    return this.http.get<any>(`${this.base}/api/products`, { params }).pipe(
      map(this.extractList),
      map(list => list.map(p => this.normalize(p))),
      shareReplay(1)
    );
  }

  /** Get by Mongo _id */
  getByMongoId(id: string): Observable<Product> {
    return this.http.get<any>(`${this.base}/api/products/${id}`).pipe(
      map(p => this.normalize(p))
    );
  }

  /** Optional: legacy numeric id lookup */
  getByNumericId(id: number): Observable<Product | undefined> {
    return this.all().pipe(map(list => list.find(p => p.id === id)));
  }
}
