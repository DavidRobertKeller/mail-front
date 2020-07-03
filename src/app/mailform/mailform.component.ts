import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MailService } from '../mail.service';
import { Router } from '@angular/router';

export interface MailDocument {
  name: string;
  type: string;
  filename: string;
  filetype: string;
  size: number;
}

@Component({
  selector: 'app-mailform',
  templateUrl: './mailform.component.html',
  styleUrls: ['./mailform.component.scss']
})

export class MailformComponent {
  public mailId = null;

  attachments: MailDocument[] = [
    // {name: 'invoice.pdf', type: 'attachment', filename: 'invoice.pdf', filetype: 'application/pdf', size: 207067},
    // {name: 'order.pdf', type: 'attachment', filename: 'order.pdf', filetype: 'application/pdf', size: 207067},
    // {name: 'receipt.pdf', type: 'attachment', filename: 'receipt.pdf', filetype: 'application/pdf', size: 407067},
  ];

  editMailForm = this.fb.group({
    id : [null],
    type : [null, Validators.required],
    subject: [null, Validators.required],
    creator: null,
    issuer: null,
    creationDate: Date,
    lastModificationDate: Date,
    issuerType: null,
    issuerReference: null,
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

  attachmentAddOnBlur = true;
  files: any[] = [];

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            const file = this.files[index];
            this.attachments.push({
              name: file.name.trim(),
              type: 'attachment',
              filename: file.name.trim(),
              filetype: file.type,
              size: file.size
            });
            this.files.splice(index, 1);
            this.uploadFilesSimulator(index);
          } else {
            this.files[index].progress += 5;
          }
        }, 50);
      }
    }, 500);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

  // addAttachment(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our attachment
  //   if ((value || '').trim()) {
  //     this.attachments.push({name: value.trim(), type: 'attachment', filename: value.trim()} );
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  removeAttachment(attachment: MailDocument): void {
    const index = this.attachments.indexOf(attachment);

    if (index >= 0) {
      this.attachments.splice(index, 1);
    }
  }

  constructor(
      private fb: FormBuilder,
      private mailService: MailService,
      private router: Router) {

    const mail = {
      id : null,
      subject: 'new mail',
      creator: null,
      creationDate: null,
      lastModificationDate: null,
      type: 'EMAIL',
      issuerType: null,
      issuerReference: null
    };

    this.mailService.create(mail).subscribe(
      data => {
        this.mailId = data.id;
        data.issuerType = null;
        data.issuerReference = null;
        this.editMailForm.setValue(data);
      },
      err => {
        console.log('err', err);
      }
    );

    this.filteredRecipients = this.recipientCtrl.valueChanges.pipe(
      startWith(null),
      map((recipient: string | null) => recipient ? this._filter(recipient) : this.allRecipients.slice()));
  }

  onSubmit() {
    const value = this.editMailForm.value;

    const mail = {
      id : value.id,
      subject: value.subject,
      creator: value.creator,
      creationDate: null,
      lastModificationDate: null,
      type: value.type.toUpperCase(),
      issuerType: null,
      issuerReference: null
    };

    this.mailService.patch(mail).subscribe(
      data => {
        this.router.navigate(['/mail']);
      },
      err => {
        console.log('err', err);
      }
    );

  }
}
