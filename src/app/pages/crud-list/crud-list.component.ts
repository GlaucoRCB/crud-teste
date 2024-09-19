import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { Profissional } from '../../profissional';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './crud-list.component.html',
  styleUrl: './crud-list.component.scss'
})
export class CrudListComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['name', 'specialty', 'crm', 'phone', 'status', 'actions'];
  dataSource = new MatTableDataSource<Profissional>([]);

  constructor(private crudService: CrudService, private snackBar: MatSnackBar, private router: Router) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadProfissionais();
  }

  async loadProfissionais() {
    this.dataSource.data = await this.crudService.getAllDatas();
  }

  async viewProfissional(id: string) {
    const profissional = await this.crudService.getData(id);
    if (profissional) {
      this.router.navigate(['/crud-form', id, { view: true }]);
    }
  }

  async deleteProfissional(id: string) {
    await this.crudService.deleteData(id);
    this.snackBar.open('Profissional deletado!', 'Fechar', {
      duration: 3000,
    });
    this.loadProfissionais();
  }

}
