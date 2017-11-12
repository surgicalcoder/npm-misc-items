import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from './SecurityService';
import { AuthGuard } from './auth.guard';

@NgModule({
	imports: [CommonModule],
	providers: [SecurityService, AuthGuard]
})

export class MiscModule { }
