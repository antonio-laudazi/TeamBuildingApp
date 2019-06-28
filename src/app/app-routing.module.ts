import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'gruppi',
    loadChildren: './pages/gruppi/gruppi.module#GruppiPageModule'
  },
  {
    path: 'list',
    loadChildren: './pages/tappe/list.module#ListPageModule'
  },
  {
    path: 'parole',
    loadChildren: './pages/parole/parole.module#ParolePageModule'
  }
  ,
  {
    path: 'tappa',
    loadChildren: './pages/tappa/tappa.module#TappaPageModule'
  }
  ,
  {
    path: 'splash',
    loadChildren: './pages/splash/splash.module#SplashPageModule'
  }
  ,
  {
    path: 'text',
    loadChildren: './pages/text/text.module#TextPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
