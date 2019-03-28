import { FormsModule } from '@angular/forms';
import { AuthActions } from './redux-stored/actions/auth.action';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { createLogger } from 'redux-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ReduxStoredComponent } from './redux-stored/redux-stored.component';
import { environment } from 'src/environments/environment.prod';
import { rootReducer } from './redux-stored/reducers/core.reducer';
import { CustomStoredComponent } from './custom-stored/custom-stored.component';
import { StoreService } from './custom-stored/store.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReduxStoredComponent,
    CustomStoredComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgReduxModule,
    FormsModule
  ],
  providers: [AuthActions, StoreService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(ngRedux: NgRedux<{}>, private devTools: DevToolsExtension) {
    let enhancers = new Array<any>();

    if (!environment.production && devTools.isEnabled()) {
      enhancers = [...enhancers, devTools.enhancer()];
    }

    ngRedux.configureStore(rootReducer, {}, [createLogger()], enhancers);
  }
}
