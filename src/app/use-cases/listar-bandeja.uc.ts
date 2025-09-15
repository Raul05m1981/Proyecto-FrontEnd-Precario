// ================================================
// 🎯 USE CASE: Listar Bandeja (mock temporal)
// Orquesta la carga para la UI (Clean Architecture).
// Cuando haya backend: reemplazar el mock por el servicio HTTP.
// ================================================
import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

import {
  BandejaItem,
  BandejaResponse,
  BandejaQuery,
  EstadoDoc
} from '../domain/dto/expediente.dto';

// 🔌 Futuro: servicio real
// import { BandejaService } from '../infrastructure/services/remoto/bandeja.service';

@Injectable()
export class ListarBandejaUC {
  // constructor(private api: BandejaService) {} // ← habilitar cuando tengas backend

  run(q: BandejaQuery): Observable<BandejaResponse> {
    // ⚠️ MOCK: datos simulados con el ORDEN exacto solicitado
    const mockItems: BandejaItem[] = [
      {
        usuario: 'rmelgarejot',
        fechaRegistro: new Date().toISOString(),
        instancia: '1° Juzgado Civil',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'https://example.com/Demanda.pdf',
        id: '1'
      },
      {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        instancia: '2° Juzgado Civil',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '2'
      },
      {
        usuario: 'elucero',
        fechaRegistro: new Date().toISOString(),
        instancia: '3° Juzgado Civil',
        juez: 'Dr. Chávez',
        especialista: 'Lic. Díaz',
        estado: 'ERROR',
        id: '3'
      }
    ];

    return of(mockItems).pipe(
      delay(400), // ⏱️ latencia simulada
      map(items => {
        // 🔎 1) Filtro por texto (usuario/instancia)
        const term = (q.search ?? '').toLowerCase().trim();
        if (term) {
          items = items.filter(i =>
            i.usuario.toLowerCase().includes(term) ||
            i.instancia.toLowerCase().includes(term)
          );
        }

        // 🎛️ 2) Filtro por estado (si no es 'TODOS')
        if (q.estado && q.estado !== 'TODOS') {
          items = items.filter(i => i.estado === q.estado);
        }

        // 📄 3) Paginación con límites sanos
        const page = Math.max(0, q.page ?? 0);
        const size = Math.min(Math.max(5, q.size ?? 10), 100);
        const total = items.length;
        const start = page * size;
        const pageItems = items.slice(start, start + size);

        // 📦 4) Respuesta en contrato de Dominio
        return { items: pageItems, total, page, size } as BandejaResponse;
      })
    );

    // ✅ Cuando conectes backend:
    // return this.api.listar(q).pipe(map(raw => this.mapApiToResponse(raw)));
  }

  // (Opcional) Mapeo API → Dominio si el backend usa otros nombres
  // private mapApiToResponse(raw: any): BandejaResponse {
  //   const items: BandejaItem[] = (raw?.items ?? []).map((r: any) => ({
  //     usuario:       r.user,
  //     fechaRegistro: r.createdAt,
  //     instancia:     r.court,
  //     juez:          r.judge,
  //     especialista:  r.clerk,
  //     estado:        r.status as EstadoDoc,
  //     url:           r.url,
  //     id:            r.id
  //   }));
  //   return { items, total: raw?.total ?? items.length, page: raw?.page ?? 0, size: raw?.size ?? items.length };
  // }
}
