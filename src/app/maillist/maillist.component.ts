import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MaillistDataSource } from './maillist-datasource';
import { MailService } from '../mail.service';
import { Mail } from '../mail';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maillist',
  templateUrl: './maillist.component.html',
  styleUrls: ['./maillist.component.css']
})
export class MaillistComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Mail>;
  dataSource: MaillistDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['type', 'state', 'subject', 'creator', 'creationDate', 'lastModificationDate'];

  constructor(private mailService: MailService, private router: Router) { }

  ngOnInit() {
    this.dataSource = new MaillistDataSource(this.mailService);
    this.dataSource.loadData();
  }

  // ngOnInit() {
  //   this.dataSource = new MaillistDataSource();
  // }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  public getRecord(row: any) {
    console.log('row', row);

    // this.router.navigate(['/mail/(side:edit)/' + row.id]);
    // this.router.navigate([{  outlets: { side: ['/mail'] } }], { skipLocationChange: true });
//    this.router.navigate([{ outlets: { primary: 'mail', side: ['add'] } }], { skipLocationChange: true });
    this.router.navigateByUrl('/mail/(side:edit/' + row.id + ')');

  }
}
