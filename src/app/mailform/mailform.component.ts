import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MailService } from '../mail.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpParams, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';

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

export class MailformComponent implements OnInit {
  public mailId = null;
  mockFileUpload = false;
  apiEndPoint = 'http://localhost:8080/api/mail/document/';

  mailStates = ['DRAFT', 'WORKING', 'CLOSED', 'ARCHIVED'];

  attachments: MailDocument[] = [
    // {name: 'invoice.pdf', type: 'attachment', filename: 'invoice.pdf', filetype: 'application/pdf', size: 207067},
    // {name: 'order.pdf', type: 'attachment', filename: 'order.pdf', filetype: 'application/pdf', size: 207067},
    // {name: 'receipt.pdf', type: 'attachment', filename: 'receipt.pdf', filetype: 'application/pdf', size: 407067},
  ];

  editMailForm = this.fb.group({
    id: [null],
    type: [null, Validators.required],
    state: [null, Validators.required],
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
  @ViewChild('recipientAuto') recipientAutocomplete: MatAutocomplete;

  signerCtrl = new FormControl();
  filteredSigners: Observable<string[]>;
  signers: string[] = ['milan@example.com'];
  allSigner: string[] = ['bob@example.com', 'alice@example.com', 'milan@example.com', 'victoria@example.com'];
  @ViewChild('signerInput') signerInput: ElementRef<HTMLInputElement>;
  @ViewChild('signerAuto') signerAutocomplete: MatAutocomplete;

  validatorCtrl = new FormControl();
  filteredValidators: Observable<string[]>;
  validators: string[] = ['victoria@example.com'];
  allValidators: string[] = ['bob@example.com', 'alice@example.com', 'milan@example.com', 'victoria@example.com'];
  @ViewChild('validatorInput') validatorInput: ElementRef<HTMLInputElement>;
  @ViewChild('validatorAuto') validatorAutocomplete: MatAutocomplete;

  attachmentAddOnBlur = true;
  files: any[] = [];


  constructor(
    private fb: FormBuilder,
    private mailService: MailService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
    }

  ngOnInit() {
    
    const mailId = this.route.snapshot.params['mail-id'];

    if (mailId == null) {
      const mail = {
        id : null,
        subject: 'new mail',
        creator: null,
        creationDate: null,
        lastModificationDate: null,
        type: 'EMAIL',
        state: 'DRAFT',
        issuer: null,
        issuerType: null,
        issuerReference: null
      };
  
      this.mailService.create(mail).subscribe(
        data => {
          this.mailId = data.id;
          data.issuerType = null;
          data.issuerReference = null;
          data.type = data.type.toLocaleLowerCase();
          this.editMailForm.setValue(data);
        },
        err => {
          console.log('err', err);
        }
      );
    } else {

      const data = {
        id : mailId,
        subject: 'TODO',
        creator: null,
        creationDate: null,
        lastModificationDate: null,
        type: 'EMAIL',
        state: 'DRAFT',
        issuer: null,
        issuerType: null,
        issuerReference: null
      };

      this.mailId = data.id;
      data.issuerType = null;
      data.issuerReference = null;
      data.type = data.type.toLocaleLowerCase();
      this.editMailForm.setValue(data);
    }

    this.filteredRecipients = this.recipientCtrl.valueChanges.pipe(
      startWith(null),
      map((recipient: string | null) => recipient ? this._filter(recipient, this.allRecipients) : this.allRecipients.slice()));

    this.filteredSigners = this.signerCtrl.valueChanges.pipe(
      startWith(null),
      map((signer: string | null) => signer ? this._filter(signer, this.allSigner) : this.allSigner.slice()));

    this.filteredValidators = this.validatorCtrl.valueChanges.pipe(
      startWith(null),
      map((validator: string | null) => validator ? this._filter(validator, this.allValidators) : this.allValidators.slice()));

  }

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

  public downloadFile() {
    let id = '5f50ff011a9e9052c554808a';

    let link = document.createElement("a");
    link.download = "filename";
    link.href = this.apiEndPoint + id;
    link.click();

    // this.http.get<any>(this.apiEndPoint + id).subscribe(res => {
    //   console.log(res);
    // }, err => {
    //   console.log(err);
    // });
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }

    if (this.mockFileUpload) {
      this.uploadFilesSimulator(0);
    }
    else {
      if(files.length > 0) {

        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');

        const formData: FormData = new FormData();
        // formData.append('file2', files[0]); 
        formData.append('file', files[0]);
        formData.append('metadata', JSON.stringify({type: 'main', isLastRevision: true}));
        
        // formData.append('type', 'main');
        // formData.append('state', 'active');
        // formData.append('isLastRevision', 'true');

        this.http.post<any>(this.apiEndPoint + this.mailId, formData, {headers}).subscribe(res => {
          console.log(res);
        }, err => {
          console.log(err);
        });
      }
    }
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

  addActor(event: MatChipInputEvent, actorType: string): void {
    const input = event.input;
    const value = event.value;

    let actors: string[] = null;
    let ctrl = null;
    if (actorType === 'recipient') {
      actors = this.recipients;
      ctrl = this.recipientCtrl;
    } else if (actorType === 'signer') {
      actors = this.signers;
      ctrl = this.signerCtrl;
    } else if (actorType === 'validator') {
      actors = this.validators;
      ctrl = this.validatorCtrl;
    }

    // Add our recipient
    if ((value || '').trim()) {
      actors.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    ctrl.setValue(null);
  }

  removeActor(recipient: string, actorType: string): void {
    let actors = null;
    if (actorType === 'recipient') {
      actors = this.recipients;
    } else if (actorType === 'signer') {
      actors = this.signers;
    } else if (actorType === 'validator') {
      actors = this.validators;
    }
    const index = actors.indexOf(recipient);

    if (index >= 0) {
      actors.splice(index, 1);
    }
  }

  selectedActor(event: MatAutocompleteSelectedEvent, actorType: string): void {
    let actors = null;
    let actorInput = null;
    let ctrl = null;
    if (actorType === 'recipient') {
      actors = this.recipients;
      actorInput = this.recipientInput;
      ctrl = this.recipientCtrl;
    } else if (actorType === 'signer') {
      actors = this.signers;
      actorInput = this.signerInput;
      ctrl = this.signerCtrl;
    } else if (actorType === 'validator') {
      actors = this.validators;
      actorInput = this.validatorInput;
      ctrl = this.validatorCtrl;
    }
    actors.push(event.option.viewValue);
    actorInput.nativeElement.value = '';
    ctrl.setValue(null);
  }

  private _filter(value: string, actors: string[]): string[] {
    const filterValue = value.toLowerCase();

    return actors.filter(actor => actor.toLowerCase().indexOf(filterValue) === 0);
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



  onSubmit() {
    const value = this.editMailForm.value;

    const mail = {
      id : value.id,
      subject: value.subject,
      creator: value.creator,
      creationDate: null,
      lastModificationDate: null,
      type: value.type.toUpperCase(),
      issuer: null,
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
