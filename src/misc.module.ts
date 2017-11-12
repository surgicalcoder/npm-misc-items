import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from './SecurityService';
import { AuthGuard } from './auth.guard';

@NgModule({
	imports: [CommonModule],
	providers: [
		{ provide: SecurityService }
	],

	 declarations: [AuthGuard],
	exports: [AuthGuard]
})

export class MiscModule { }
