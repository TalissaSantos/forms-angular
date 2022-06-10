import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  distinctUntilChanged,
  empty,
  Observable,
  switchMap,
  map,
  tap,
} from 'rxjs';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';
import { FormValidations } from '../shared/services/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
// HERANÇA O EXTEND
export class DataFormComponent extends BaseFormComponent implements OnInit {
  // formulario!: FormGroup;

  estados!: EstadoBr[];
  // por conta do pipe async pra não entrar nenhum dado a mais
  // estados!: Observable<EstadoBr[]>;

  //COMBOBOX COM OBJ
  cargos!: any[];

  // COMBOBOX MULTIPLE
  tecnologias!: any[];

  // RADIO BUTTON
  newsletterOp!: any[];

  // FORMARRAY
  dadosFrameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  // combobox aninhado
  cidades!: Cidade[];

  // com construtor de formulario
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    //Validação assincrona
    private verificaEmailService: VerificaEmailService
  ) {
    // HERANÇA
    super();
  }

  override ngOnInit() {
    //Validação assincrona por conta observable precisa do subscribe
    // this.verificaEmailService.verificarEmail('email@email.com').subscribe();

    //a inscrição do observable esta ficando ativa na memoria e mesmo que não esteja sendo usada fica salvo
    // this.dropdownService.getEstadosBR()
    // .subscribe(dados => {this.estados = dados; console.log(dados);
    // })
    // OU
    //por estar usando o pipe async ele vai destruir os dados que não forem mais usados
    // this.estados = this.dropdownService.getEstadosBR();

    // COMBOBOX ANINHADO
    this.dropdownService.getEstadosBR()
    // cache local
    .subscribe(dados => this.estados = dados);

    // COMBOBOX COM OBJ
    // Serve para pegar todas as informações qe estão no dropdown
    this.cargos = this.dropdownService.getCargos();

    //COMBOBOX MULTIPLE
    this.tecnologias = this.dropdownService.getTecnologias();

    //RADIO BUTTON
    this.newsletterOp = this.dropdownService.getNewsletter();

    // // criação do formulario
    // this.formulario = new FormGroup({
    //   // com o formControl vc consegue colocar o valor que quer iniciar o campo
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // });

    //  ou

    // // criação do formulario
    // com o construtor
    //são os nomes que vao entrar no formarray,ou controlName do html
    this.formulario = this.formBuilder.group({
      nome: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(35),
        ],
      ],
      // depois da virgula é validacao assincrona
      email: [
        null,
        [Validators.required, Validators.email],
        [this.validaEmail.bind(this)],
      ],
      // Comparar dados
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],

      // pra agrupa os campos
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
      //COMBOBOX COM OBJ
      cargo: [null],

      // combobox multiple
      tecnologias: [null],

      // rabio button como é uma newsletter vc chumba no codigo o sim
      newsletter: ['s'],

      // CHECKBOX TOGGLE
      termos: [null, Validators.pattern('true')],

      //FORMARRAY
      frameworks: this.buildFrameworks(),
    });
    // MUDANÇAS REATIVA
    // aninha os 2 observable
    this.formulario
      .get('endereco.cep')
      ?.statusChanges.pipe(
        // ele faz com que pegue somente a validação correta
        distinctUntilChanged(),
        tap((value) => console.log('status CEP:', value)),
        // pega o valor e retorna um observable
        switchMap((status) =>
          status === 'VALID'
            ? this.cepService.consultaCEP(
                this.formulario.get('endereco.cep')?.value
              )
            : // retorna um observable vazio sem valor
              empty()
        )
      )
      // só popula os dados caso o observable acima esteja valido
      .subscribe((dados) => (dados ? this.populaDadosForm(dados) : {}));

    // combobox aninhado
    this.formulario.get('endereco.estado')?.valueChanges
    .pipe(
      tap(estado => console.log('Novo estado:', estado)),
      // filtra se a sigla passa é a mesma
      map(estado => this.estados.filter(e => e.sigla === estado )),
      // verifica se estados existe se encontrou a sigla e caso contrario o empty faz o fechamento
      map(estados => estados && estados.length >
          0 ? estados[0].id : empty()),
        // faz a troca
        switchMap((estadoId: any) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
    )

    .subscribe(cidades => this.cidades = cidades);

    // this.dropdownService.getCidades(8).subscribe(console.log);

    //  {

    //   if(status === 'VALID'){
    // (vai pegar o status do valor)
    //     this.cepService.consultaCEP(this.formulario.get('endereco.cep')?.value)
    //   .subscribe((dados) => this.populaDadosForm(dados));
    //   }
    // });
  }

  //FORMARRAY será passado toda lógica
  buildFrameworks() {
    //esta fazendo um novo array para cada valor do formControl
    const values = this.dadosFrameworks.map((v) => new FormControl(false));
    // com o formValidation esta fazendo a validacao costumozida
    return this.formBuilder.array(
      values,
      FormValidations.requiredMinCheckbox(1)
    );

    // // esta retornando o valor
    // return this.formBuilder.array(values);
    //   this.formBuilder.array( [
    // // Esta inicializando com falso pq os campos estao desmarcamos quando acessado // Esta inicializando com falso pq os campos estao desmarcamos quando acessado
    //     new FormControl(false),
    //     new FormControl(false),
    //     new FormControl(false),
    //     new FormControl(false)

    //   ]);
  }
  // HERANÇA
  submit() {
    // // FORMARRAY
    // //Pegando o valor que o usuario clicar, esta copiando o valor da variavel para o submit
    // // esta copiando o os valores dos campos
    let valueSubmit = Object.assign({}, this.formulario.value);

    // // vai aparecer só quando estiver true e mostrar o valor(angular,react..)

    valueSubmit = Object.assign(valueSubmit, {
      //   // imutabilidade de obj pra melhorar a acessibilidade
      frameworks: valueSubmit.frameworks
        .map((v: any, i: any) => (v ? this.dadosFrameworks[i] : null))
        //     // esta filtrando os valores de nulo
        .filter((v: any) => v !== null)
        //     // Pega todos os valores positivos(true),nulo...
        .filter((v: any) => !!v),
    });
    console.log(valueSubmit);

    this.http
      .post('https://httpbin.org/post', JSON.stringify(valueSubmit))

      //   //  // mapeia as respostas que estao vindo do servidor
      //  .pipe(map((res) => res))

      //   //ele pede pra fazer a chamada no servidor
      .subscribe(
        (dados) => {
          console.log(dados);

          //       // reseta o form colocando aqui ele vai primeiro submete dps reseta
          this.formulario.reset();
          //       // ou  usando o botao
          this.resetar();
        },
        (erro: any) => alert('Erro')
      );
  }

  // pesquisando endereço e completa automatico
  consultaCEP() {
    let cep = this.formulario.get('endereco.cep')?.value;
    //  console.log(cep);
    if (cep != null && cep !== '') {
      // retorna um servico com observable
      this.cepService
        .consultaCEP(cep)
        .subscribe((dados) => this.populaDadosForm(dados));
    }
  }
  populaDadosForm(dados: any) {
    // this.formulario.setValue({});
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
    //para poluar um campo logo que o cep for colocado
    this.formulario.get('nome')?.setValue('Talissa');
  }

  //patchValue faz apenas uma correção
  resetaDadosForm() {
    // this.formulario.patchValue({
    //   endereco: {
    //     rua: null,
    //     complemento: null,
    //     bairro: null,
    //     cidade: null,
    //     estado: null,
    //   },
    // });

    this.formulario.get('endereco')?.reset();
  }

  //COMBOBOX COM OBJ
  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pl' };
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargo(obj1: any, obj2: any) {
    // esta comparando se o obj é igual ao nome e ao nivel
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 === obj2;
  }

  setarTecnologias() {
    this.formulario.get('tecnologias')?.setValue(['Java', 'JavaScript', 'PHP']);
  }

  //     //FORMARRAY metodo pra declarar todos os controles
  getFormControls() {
    const formArray = this.formulario.get('frameworks') as FormArray;

    // console.log(formArray);

    return formArray.controls;
  }

  // MENSAGEM DE ERRO
  getControl(control: string) {
    // pra transforma em formControl
    const formControl = this.formulario.get(control) as FormControl;

    return formControl;
  }

  // getFrameworksControls() {
  //   return this.formulario.get('frameworks')
  //     ? (<FormArray>this.formulario.get('frameworks')).controls
  //     : null;
  // }

  // validação de email
  validaEmail(formControl: FormControl) {
    // esta pegando o valor do campo
    return this.verificaEmailService.verificarEmail(formControl.value).pipe(
      // se o email exite retorna true se nao é nulo
      map((emailExiste) => (emailExiste ? { emailInvalido: true } : null))
    );
  }
}
