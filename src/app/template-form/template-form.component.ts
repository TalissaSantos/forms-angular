import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css'],
})
export class TemplateFormComponent implements OnInit {
  usuario: any = {
    nome: null,
    email: null,
  };

  onSubmit(formulario: any) {
    console.log(formulario);
    // console.log(this.usuario);

    //FAZENDO CHAMADO AO SERVIDOR
    this.http
      .post('https://httpbin.org/post', JSON.stringify(formulario.value))
      // mapeia as respostas que estao vindo do servidor
      .pipe(map((res) => res))
      //ele pede pra fazer a chamada no servidor
      .subscribe((dados) => {
        console.log(dados);
        // formulario é o atributo do onsubmit
        formulario.form.reset();
      });
  }

  // pesquisando endereço e completa automatico
  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) {}

  ngOnInit(): void {}

  verificaValidTouched(campo: any) {
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo: any) {
    return {
      'needs-validation': this.verificaValidTouched(campo),
      'was-validated': this.verificaValidTouched(campo),
    };
  }
  // pesquisando endereço e completa automatico
  consultaCEP(cep: any, form: any) {
    //  console.log(cep);

    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');
    //  console.log(cep);
    if (cep != null && cep !== '') {
      // chama so o serviço com observable
      this.cepService.consultaCEP(cep)
        .subscribe((dados) => this.populaDadosForm(dados, form));
    }

    //    //Verifica se campo cep possui valor informado.
    //    if (cep != "") {
    //    //Expressão regular para validar o CEP. força o usuario passar um cep de 8 digitos
    //    let validacep = /^[0-9]{8}$/;
    //    //Valida o formato do CEP.
    //    if(validacep.test(cep)) {
    //     //  para resetar o formulario antes de pega as informacao
    //     this.resetaDadosForm(form)

    //   //Faz a chamada ajax para obter o json no angular
    //   // usando template literal no ()
    //   // get vai busca informações do servidor
    //       this.http.get(`//viacep.com.br/ws/${cep}/json`)
    //       // esta mapeando as info que vieram do json
    //       .pipe(map((dados: any) => dados))
    //       // notifica quando a info estiver pronta (parecido com callback)
    //       .subscribe(dados => this.populaDadosForm(dados,form))
    //   }

    // }
  }
  // está passando o paramentro dos dados que vai receber e o form é onde sera inserido os dados
  populaDadosForm(dados: any, formulario: any) {
    // formulario.setValue({
    //   nome: formulario.value.nome,
    //   email: formulario.value.email,
    //   endereço: {
    //     rua: dados.logradouro ,
    //     cep: dados.cep ,
    //     numero: '',
    //     complemento: dados.complemento,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf,
    //   }
    // });
    // usando o patchValue
    formulario.form.patchValue({
      endereço: {
        rua: dados.logradouro,
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
    // para procurar a informação do que esta pegando tanto no formulario
    // console.log(form);
  }

  resetaDadosForm(formulario: any) {
    formulario.form.patchValue({
      endereço: {
        rua: null,
        cep: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }
}
