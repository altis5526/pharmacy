import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliverStateComponent } from './deliver-state.component';
const routes: Routes = [{path: '', component: DeliverStateComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliverStateRoutingModule { }
