import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class FormValidations {
  // Programação estruturada (função de validação)
  // (min = 1) é para que no minimo seja selecionado 1 campo
  static requiredMinCheckbox(min = 1) {
    // é para validação
    const validator = (formArray: AbstractControl) => {
      // intera os campos do buildFrameworks
      // const  values = FormArray.controls;
      // let totalChecked = 0;
      // for (let i = 0; i < values.length; i++) {
      //   if( values[i].value){
      //     totalChecked += 1;
      //   }
      // }
      if (formArray instanceof FormArray) {
        // Programação funcionaal (função de validação)
        const totalChecked = formArray.controls
          .map((v) => v.value)
          // faz a mesma coisa que a programação estruturada de cima (linha 134)
          .reduce((total, current) => (current ? total + current : total), 0);
        return totalChecked >= min ? null : { required: true };
      }
      throw new Error('formArray is not an instance of FormArray');
    };
    return validator;
  }

  // validação do cep
  static cepValidator(control: FormControl) {
    const cep = control.value;

    if (cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido: true };
    }

    return null;
  }

  // validar qualquer campo do formulario(AQUI É DE EMAIL)
  static equalsTo(outroCampo: string) {
    // Usado validator por conta de não ter um validator no parametro
    const validator = (formControl: FormControl) => {
      if (outroCampo == null) {
        throw new Error('É necessario informar um campo! ');
      }
      // esta verificando se o formulario ja foi renderizado
      // é para validar quando o controle estiver recebendo
      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      // propriedade root pega a propriedade raiz parent pega o aninhamento
      const field = (<FormGroup>formControl.root).get(outroCampo);
      if (!field) {
        throw new Error('É necessario informar um campo válido!');
      }
      // se for diferente do formcontro vai retorna invalido
      if (field.value !== formControl.value) {
        return { equalsTo: outroCampo };
      }
      // se campo for igual retorna nulo
      return null;
    };
    return validator;
  }

  // MENSAGEM DE ERRO
  static getErrorMsg(fieldName: string, validatorName:string, validatorValue?:any){
    const config: { [id: string] : string } = {
      'required':`${fieldName} é obrigatório.`,
      'minlength': `${fieldName} precisa ter no minimo ${validatorValue.requiredLength} caracter`,
      'maxlength': `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracter`,
      'cepInvalido': 'CEP inválido.'
    }
    return config[validatorName];
  }


}
