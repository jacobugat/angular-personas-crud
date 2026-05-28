import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Empleado, RolEmpleado } from '../../models/empleado.model';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);

  empleados: Empleado[] = [];
  guardando = false;
  error = '';

  roles: { value: RolEmpleado; label: string }[] = [
    { value: 'ASESOR', label: 'Asesor inmobiliario' },
    { value: 'ADMINISTRADOR', label: 'Administrador' }
  ];

  nuevo: Empleado = this.crearEmpleadoVacio('ASESOR');

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => this.empleados = empleados,
      error: () => this.error = 'No se pudieron cargar los empleados.'
    });
  }

  cambiarRol(rol: RolEmpleado) {
    this.nuevo.usuario.role = rol;
  }

  guardar() {
    this.error = '';

    if (!this.nuevo.nombre || !this.nuevo.apellido || !this.nuevo.telefono || !this.nuevo.usuario.username || !this.nuevo.usuario.password) {
      this.error = 'Completa nombre, apellido, telefono, usuario y contrasena.';
      return;
    }

    this.guardando = true;
    this.empleadoService.createEmpleado(this.nuevo).subscribe({
      next: () => {
        const rolActual = this.nuevo.usuario.role;
        this.nuevo = this.crearEmpleadoVacio(rolActual);
        this.guardando = false;
        this.cargar();
      },
      error: (err) => {
        this.guardando = false;
        this.error = err?.error?.message || 'No se pudo guardar el empleado.';
      }
    });
  }

  private crearEmpleadoVacio(role: RolEmpleado): Empleado {
    return {
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
      notasInternas: '',
      metaVentasMensual: 0,
      comisionesAcumuladasAnual: 0,
      propiedadesCaptadasMes: 0,
      fechaContratacion: '',
      usuario: {
        username: '',
        password: '',
        role
      }
    };
  }
}
