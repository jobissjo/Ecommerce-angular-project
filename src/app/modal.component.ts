import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	template: `
		<div style="background-color: #dcdcdc;" class="modal-header">
			<h4 style="color:blueviolet;" class="modal-title">Login To Continue</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div style="background-color: #f6f6f6;" class="modal-body">
			<p>Hello, User {{name}}</p>
		</div>
		<div style="background-color: #f6f6f6;" class="text-center modal-footer">
			<button type="button" class="text-center btn btn-outline-dark" (click)="activeModal.close('Close click')">Okay</button>
		</div>
	`,
    styles: [
        
    ]
})
export class NgbdModalContent {
	@Input() name:any;

	constructor(public activeModal: NgbActiveModal) {}
}