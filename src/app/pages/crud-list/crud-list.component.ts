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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { AlertComponent } from '../../components/alert/alert.component';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgIf,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './crud-list.component.html',
  styleUrl: './crud-list.component.scss'
})
export class CrudListComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['name', 'specialty', 'crm', 'phone', 'status', 'actions'];
  dataSource = new MatTableDataSource<Profissional>([]);
  isLoading: boolean = true;


  constructor(private crudService: CrudService, private snackBar: MatSnackBar, private router: Router, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  ngOnInit() {
    this.loadProfissionais();
  }

  async loadProfissionais() {
    this.isLoading = true;
    this.dataSource.data = await this.crudService.getAllDatas();
    this.isLoading = false;
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  async viewProfissional(id: string) {
    const profissional = await this.crudService.getData(id);
    if (profissional) {
      this.router.navigate(['/crud-form', id, { view: true }]);
    }
  }

  async deleteProfissional(profissional: Profissional) {
    const dialogRef = this.dialog.open(AlertComponent, { width: '400px', data: profissional.nome });
    dialogRef.afterClosed().subscribe(result => {
      if (result as unknown as boolean) {
        this.isLoading = true;
        this.crudService.deleteData(profissional.id);
        this.snackBar.open('Profissional deletado!', 'Fechar', {
          duration: 3000,
        });
        this.loadProfissionais();
      }
    });
  }
}
