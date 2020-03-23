import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Mail } from './mail';

@Injectable({ providedIn: 'root' })
export class MailService {

  private url = 'http://localhost:8080/api/mail/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    })
  };

  constructor(private http: HttpClient) { }

  /** GET mails from the server */
  getMails(): Observable<Mail[]> {

    return this.http.get<Mail[]>(this.url, this.httpOptions)
      .pipe(
        tap(_ => console.log('fetched mails')),
        catchError(this.handleError<Mail[]>('getMails', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
    console.log(message);
  }
}
