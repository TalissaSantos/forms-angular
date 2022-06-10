import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { DataFormComponent } from './data-form/data-form.component';
import { TemplateFormComponent } from './template-form/template-form.component';



export const routes: Routes = [
  { path: 'templateForm', component: TemplateFormComponent },
  { path: 'dataForm', component: DataFormComponent },
  //é o caminho onde vai abri a primeira pagina na tela inicial
  { path: '', pathMatch: 'full', redirectTo: 'dataForm' },


];
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]

})
export class AppRoutingModule {}
