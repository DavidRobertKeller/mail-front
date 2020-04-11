import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-mailform',
  templateUrl: './mailform.component.html',
  styleUrls: ['./mailform.component.css']
})
export class MailformComponent {
  addressForm = this.fb.group({
    type : ['email', Validators.required],
    subject: [null, Validators.required],
    issuerType: [null],
    issuerReference: [null],
  });

  mailObjectTypes = ['contact', 'emailAddress'];


  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  recipientCtrl = new FormControl();
  filteredRecipients: Observable<string[]>;
  recipients: string[] = ['bob@example.com'];
  allRecipients: string[] = ['bob@example.com', 'alice@example.com', 'milan@example.com', 'victoria@example.com'];

  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private fb: FormBuilder) {
    this.filteredRecipients = this.recipientCtrl.valueChanges.pipe(
      startWith(null),
      map((recipient: string | null) => recipient ? this._filter(recipient) : this.allRecipients.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our recipient
    if ((value || '').trim()) {
      this.recipients.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.recipientCtrl.setValue(null);
  }

  remove(recipient: string): void {
    const index = this.recipients.indexOf(recipient);

    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.recipients.push(event.option.viewValue);
    this.recipientInput.nativeElement.value = '';
    this.recipientCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allRecipients.filter(recipient => recipient.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit() {
    alert('Thanks!');
  }
}
