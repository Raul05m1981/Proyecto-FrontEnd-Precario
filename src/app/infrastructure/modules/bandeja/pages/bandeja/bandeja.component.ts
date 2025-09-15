import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

import { ListarBandejaUC } from '../../../../../use-cases/listar-bandeja.uc';
import { BandejaItem, BandejaQuery, BandejaResponse, EstadoDoc } from '../../../../../domain/dto/expediente.dto';

@Component({
  standalone: true,
  selector: 'sp-bandeja',
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DropdownModule, TagModule, CardModule, MessageModule
  ],
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
  providers: [ListarBandejaUC]
})
export class BandejaComponent {
  private uc = inject(ListarBandejaUC);

  loading = signal(false);
  error = signal<string | undefined>(undefined);

  // Estado de la tabla
  items = signal<BandejaItem[]>([]);
  total = signal(0);
  page = signal(0);
  size = signal(10);

  // Filtros (signals)
  search = signal<string>('');
  estado = signal<EstadoDoc | 'TODOS'>('TODOS');

  // Debe ser mutable (sin "as const")
  estados = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Generado', value: 'GENERADO' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'Error', value: 'ERROR' },
  ];

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading.set(true);
    this.error.set(undefined);

    const q: BandejaQuery = {
      page: this.page(),
      size: this.size(),
      search: this.search().trim() || undefined,
      estado: this.estado()
    };

    this.uc.run(q).subscribe({
      next: (res: BandejaResponse) => {
        this.items.set(res.items);
        this.total.set(res.total);
        this.page.set(res.page);
        this.size.set(res.size);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const msg = (err as any)?.message ?? 'No se pudo cargar la bandeja';
        this.error.set(msg);
        this.loading.set(false);
      }
    });
  }

  onPage(event: { first: number; rows: number }) {
    this.page.set(Math.floor((event.first ?? 0) / (event.rows ?? this.size())));
    this.size.set(event.rows ?? this.size());
    this.cargar();
  }

  colorEstado(e: EstadoDoc): 'success' | 'warning' | 'danger' {
    switch (e) {
      case 'GENERADO':  return 'success';
      case 'EN_PROCESO': return 'warning';
      case 'ERROR':     return 'danger';
      default:          return 'warning';
    }
  }

  ver(row: BandejaItem) {
    if (row.url) window.open(row.url, '_blank');
  }
  descargar(row: BandejaItem) {
    if (row.url) window.open(row.url, '_blank');
  }
  reintentar(_row: BandejaItem) {
    // TODO: llamar a servicio reintentar y luego refrescar
    this.cargar();
  }
  eliminar(_row: BandejaItem) {
    // TODO: llamar a servicio eliminar y luego refrescar
    this.cargar();
  }
}
