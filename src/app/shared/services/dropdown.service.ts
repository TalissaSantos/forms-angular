import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Cidade } from '../models/cidade';
import { EstadoBr } from './../models/estado-br';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(private http: HttpClient) {}

  getEstadosBR() {
    return this.http.get<EstadoBr[]>('assets/dados/estadosbr.json');
  }

  // ngValue e compareWith

  getCargos() {
    return [
      { nome: 'Dev', nivel: 'Junior', descricao: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', descricao: 'Dev Sr' },
    ];
  }
  // COMBOBOX MULTIPLE
  getTecnologias() {
    return [
      { nome: 'java', descricao: 'Java' },
      { nome: 'javaScript', descricao: 'JavaScript' },
      { nome: 'php', descricao: 'PHP' },
      { nome: 'c#', descricao: 'C#' },
    ];
  }

  // RADIO BUTTON
  getNewsletter() {
    return [
      { valor: 's', descricao: 'Sim' },
      { valor: 'n', descricao: 'Não' },
    ];
  }

  // COMBOBOX ANINHADO
  getCidades(idEstado: number){
    return this.http.get<Cidade[]>('assets/dados/cidades.json')
    .pipe(
      // filtra todos os estados que são do espirito santo id 8
      map((cidades: Cidade[]) => cidades.filter(c => c.estado == idEstado))
      )
  }

}
