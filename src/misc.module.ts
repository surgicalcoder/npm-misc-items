import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common'
import {DateAgoPipe} from './date-ago.pipe'

@NgModule({
	imports: [CommonModule],
	declarations: [DateAgoPipe],
	exports: [DateAgoPipe]
})

export class MiscModule { }
