import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../authentication-service/authentication.service';
import { map, catchError } from 'rxjs/operators';

export interface UserData {
  items: User[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    return this.http.get('/api/user', { params }).pipe(
      map((userData: UserData) => userData),
      catchError((err) => throwError(err))
    );
  }

  paginateByName(
    page: number,
    size: number,
    username: string
  ): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    return this.http
      .get(`/api/user/search/by/username/${username}`, { params })
      .pipe(
        map((userData: UserData) => userData),
        catchError((err) => throwError(err))
      );
  }
}
