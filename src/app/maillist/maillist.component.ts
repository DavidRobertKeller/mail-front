import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MaillistDataSource } from './maillist-datasource';
import { MailService } from '../mail.service';
import { Mail } from '../mail';

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
  displayedColumns = ['subject', 'creator', 'creationDate', 'lastModificationDate'];

  constructor(private mailService: MailService) { }

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
}
