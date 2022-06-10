import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

// verfica se os emails existente estao no banco de dados json
  verificarEmail(email:string){
    //caminho da url
    return this.http.get('assets/dados/verificarEmail.json')
    .pipe(
      // tempo para fazer a chamada no servidor
      delay(2000),
      // esta pegando os dados ;esta pegando a propriedade que ta no json
      map((dados: any) => dados.emails),
      // serve pra debuga
      tap(console.log),
      // retorna o email se ele for igual ao que esta acima
      map((dados: {email:string}[])=> dados.filter(v => v.email === email)),
      // serve pra debuga
      tap(console.log),
      // se tiver obj dentro dos dados  encontrou o email no servidor
      map((dados: any[]) => dados.length > 0),
      // serve pra debuga
      tap(console.log)
      )

  }
  // verificarEmail(email: string) {
  //   return this.http.get('assets/dados/verificarEmail.json')
  //     .pipe(

  //       map((dados: {emails: any[]}) => dados.emails),
  //       // tap(console.log),
  //       map((dados: {email: string}[]) => dados.filter(v => v.email === email)),
  //       // tap(console.log),
  //       map((dados: any[]) => dados.length > 0 )
  //       // tap(console.log)
  //     );
  // }




}
