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

  displayedColumns = ['type', 'state', 'subject', 'creator', 'creationDate', 'lastModificationDate'];

  constructor(private mailService: MailService, private router: Router) { }

  ngOnInit() {
    this.dataSource = new MaillistDataSource(this.mailService);
    this.dataSource.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  public getRecord(row: any) {
    this.router.navigateByUrl('/mail/(side:edit/' + row.id + ')');
  }
}
