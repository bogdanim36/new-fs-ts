import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

import {AppLayoutModule} from '@app/layout/app-layout.module';
import {AppSharedService} from '@app/core/app-shared.service';
import {AdminModule} from "@app/admin/admin.module";
import {ModalConfirmComponent} from './components/modal-confirm/modal-confirm.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        AppComponent,
        ModalConfirmComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        AppLayoutModule,
        AdminModule,
    ],
    bootstrap: [AppComponent],
    providers: [AppSharedService]
})
export class AppModule {
}
