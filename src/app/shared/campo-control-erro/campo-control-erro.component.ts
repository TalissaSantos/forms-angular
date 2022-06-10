import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-campo-control-erro',
  templateUrl: './campo-control-erro.component.html',
  styleUrls: ['./campo-control-erro.component.css']
})
export class CampoControlErroComponent implements OnInit {

//para usar no html campo-control e no html principal (template-form.html)
     @Input() mostrarErro?: boolean;
     @Input() msgErro?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
