import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Profissional } from '../../profissional';
import { CrudService } from '../../services/crud.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-crud-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf,
    MatProgressSpinnerModule
  ],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.scss'
})
export class CrudFormComponent {

  profissionalForm!: FormGroup;
  profissionalId!: string | null;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  isLoading: boolean = false;

  specialties = [
    { especialidade: 'Pediatria' },
    { especialidade: 'Ginecologia' },
    { especialidade: 'Obstetrícia' },
    { especialidade: 'Neonatologia' },
    { especialidade: 'Endocrinologia Pediátrica' },
    { especialidade: 'Nutrição Infantil' },
    { especialidade: 'Genética Pediátrica' },
    { especialidade: 'Alergologia Pediátrica' },
  ];

  daysOfWeek = [
    { name: 'Segunda-feira' },
    { name: 'Terça-feira' },
    { name: 'Quarta-feira' },
    { name: 'Quinta-feira' },
    { name: 'Sexta-feira' },
    { name: 'Sábado' },
    { name: 'Domingo' },
  ];


  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.profissionalForm = this.fb.group({
      nome: ['', Validators.required],
      especialidade: ['', Validators.required],
      crm: ['', Validators.required],
      contato: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataContrato: ['', Validators.required],
      inicioAtendimento: ['', Validators.required],
      fimAtendimento: ['', Validators.required],
      diasAtendimento: this.fb.array([]),
      status: ['', Validators.required]
    });

    this.addCheckboxes();

    const id = this.route.snapshot.paramMap.get('id');
    const viewMode = this.route.snapshot.paramMap.get('view') === 'true';

    if (id) {
      this.profissionalId = id;
      if (viewMode) {
        this.isViewMode = true;
        this.loadProfissionalData(id);
        this.profissionalForm.disable();
      }
      else {
        this.isEditMode = true;
        this.loadProfissionalData(id);
      }
    }
  
  }

  private addCheckboxes() {
    const diasAtendimentoArray = this.profissionalForm.get('diasAtendimento') as FormArray;
    this.daysOfWeek.forEach(() => {
      diasAtendimentoArray.push(this.fb.control(false));
    });
  }

  async loadProfissionalData(id: string) {
    this.isLoading = true;
    const profissional = await this.crudService.getData(id);
    if (profissional) {
      this.profissionalForm.patchValue({
        nome: profissional.nome,
        especialidade: profissional.especialidade,
        crm: profissional.crm,
        contato: profissional.contato,
        email: profissional.email,
        dataContrato: profissional.dataContrato,
        inicioAtendimento: profissional.inicioAtendimento,
        fimAtendimento: profissional.fimAtendimento,
        status: profissional.status,
      });

      this.setCheckboxes(profissional.diasAtendimento);
    }
    this.isLoading = false;
  }

  private setCheckboxes(diasAtendimento: boolean[]) {
    const diasAtendimentoArray = this.profissionalForm.get('diasAtendimento') as FormArray;
    diasAtendimento.forEach((checked, index) => {
      if (checked) {
        diasAtendimentoArray.at(index).setValue(true);
      }
    });
  }


  async saveForm() {

    const profissionais = await this.crudService.getAllDatas();

    const emailExist = profissionais.some((profissional: Profissional) =>
      profissional.email === this.profissionalForm.get('email')?.value && 
      (!this.profissionalId || this.profissionalId !== profissional.id)
    );

    if (emailExist) {
      this.snackBar.open('Este Email já está sendo utilizado!', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const crmExist = profissionais.some((profissional: Profissional) =>
      profissional.crm === this.profissionalForm.get('crm')?.value && 
      (!this.profissionalId || this.profissionalId !== profissional.id)
    );

    if (crmExist) {
      this.snackBar.open('Este crm já está sendo utilizado!', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (this.profissionalForm.invalid) {
      this.snackBar.open('Preencha todos os campos obrigatórios!', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      this.profissionalForm.markAllAsTouched();
      return;
    }

    const profissionalData = this.profissionalForm.value as Profissional;

    if (profissionalData.dataContrato instanceof Date) {
      profissionalData.dataContrato = profissionalData.dataContrato.toISOString();
    }

    if (this.profissionalId) {
      await this.crudService.updateData(profissionalData, this.profissionalId);
      this.snackBar.open('Profissional editado!', 'Fechar', {
        duration: 3000,
      });
    } 
    
    else {
      await this.crudService.createData(profissionalData);
      this.snackBar.open('Profissional cadastrado com sucesso!', 'Fechar', {
        duration: 3000,
      });
    }
    this.profissionalForm.reset();
  }
}
