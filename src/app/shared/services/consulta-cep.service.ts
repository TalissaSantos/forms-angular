import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }
    // pesquisando endereço e completa automatico
    consultaCEP(cep: string){

      console.log(cep);

       //Nova variável "cep" somente com dígitos.
       cep = cep.replace(/\D/g, '');

       //Verifica se campo cep possui valor informado.
       if (cep != "") {
       //Expressão regular para validar o CEP. força o usuario passar um cep de 8 digitos
       let validacep = /^[0-9]{8}$/;
       //Valida o formato do CEP.
       if(validacep.test(cep)) {
// com isso proprio subscribe fara a chamada
        return   this.http.get(`//viacep.com.br/ws/${cep}/json`);

      }
        //  para resetar o formulario antes de pega as informacao
        // this.resetaDadosForm()

      //Faz a chamada ajax para obter o json no angular
      // usando template literal no ()
      // get vai busca informações do servidor


      //usando so o return o proprio observable fara a pesquisa do cep
          // esta mapeando as info que vieram do json
          // .pipe(map((dados: any) => dados))
          // // notifica quando a info estiver pronta (parecido com callback)
          // .subscribe(dados => this.populaDadosForm(dados))


    }

    // retorno do observable vazio pra que o formulario receba tmb um erro quando receber algo errado
  return of({})

    }
}
