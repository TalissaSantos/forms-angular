import { ThisReceiver } from '@angular/compiler';
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>',

})
export abstract  class  BaseFormComponent implements OnInit {

  formulario!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }
  abstract submit():any;

  onSubmit(){
    if(this.formulario.valid){
      this.submit();
    } else {
    // pega o formulario
    this.verificaValidacoesForm(this.formulario);

}
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo);
      // Pega todos os arrays (todos os campos)
      const controle = formGroup.get(campo);
      //markAsDirty Marca quando o campo foi modificado
      controle?.markAsTouched();
      controle?.markAsDirty();
      // verifica se o obj controle tem uma instancia
      //  com formgroup vai pega o
      //  endereço e o nome
      if (controle instanceof FormGroup || controle instanceof FormArray ) {
        this.verificaValidacoesForm(controle);
      }
    });

  }
  // serve para conseguir acessar um grupo de informações

  resetar() {
    this.formulario.reset();
  }

// acessoa ao formcontrol e css validação
  // classe utilitaria pra usar no projeto todo

  verificaValidTouched(campo: string) {
    // com o metodo get é retornado a instancia do metodo control linha 27
    return (
      !this.formulario.get(campo)?.valid &&
      !!this.formulario.get(campo)?.touched
    );
  }

  // classe utilitaria pra usar no projeto todo
  verificaRequired(campo: string) {
    // com o metodo get é retornado a instancia do metodo control linha 27
    return (
      !this.formulario.get(campo)?.hasError('required') ||
      !!this.formulario.get(campo)?.touched
    );
    //É possivel fazer esse acesso com controls
  // this.formulario.controls[campo]
  }

  // acessoa ao formcontrol e css validação
  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if (campoEmail?.errors) {
      return campoEmail?.errors['email'] && campoEmail?.touched;
    }
  }

   // acessoa ao formcontrol e css validação
   aplicaCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'was-validated': this.verificaValidTouched(campo),
    };
  }

}
