// =========================================
// MAIN-LAYOUT (presentación / UI state)
// - Topbar + Sidebar degradado + RouterOutlet
// - Menú con roles, búsqueda y submenús
// - Sin lógica de negocio ni HTTP
// =========================================
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// 🧩 Modelo UI del menú
interface MenuItem {
  id: string;                 // Identificador estable (para expandir)
  label: string;              // Texto visible
  icon?: string;              // PrimeIcons (ej: 'pi pi-home') o emoji
  route?: string;             // Ruta a navegar (si no tiene hijos)
  roles?: string[];           // Control de visibilidad por rol
  badge?: string | number;    // Chip (NEW, 15, etc.)
  children?: MenuItem[];      // Submenú
}

@Component({
  standalone: true,
  selector: 'sp-main-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  // Router solo para logout/redirección (sin negocio)
  private router = inject(Router);

  // =========================================
  // 🔒 Roles actuales del usuario (adapter real vendrá luego)
  // =========================================
  roles = signal<string[]>(this.readRolesFromStorage());

  // =========================================
  // 🔎 Búsqueda local del menú (solo UI)
  // =========================================
  search = new FormControl('', { nonNullable: true });

  // =========================================
  // 📂 Definición estática del menú (presentación)
  // =========================================
  private allMenu: MenuItem[] = [
    { id: 'home', label: 'Inicio', icon: 'pi pi-home', route: '/home', roles: ['CIVIL','ADMIN','LECTOR'] },

    {
      id: 'civil',
      label: 'Módulo Civil',
      icon: 'pi pi-sitemap',
      roles: ['CIVIL','ADMIN'],
      children: [
        { id: 'civil-generador', label: 'Generador de documentos', icon: 'pi pi-file-edit', route: '/generador' },
        { id: 'civil-bandeja',   label: 'Bandeja de documentos',   icon: 'pi pi-briefcase', route: '/bandeja', badge: 'NEW' },
      ],
    },

    { id: 'ayuda', label: 'Ayuda', icon: 'pi pi-info-circle', route: '/home', roles: ['CIVIL','ADMIN','LECTOR'] },
  ];

  // =========================================
  // ▶️ Estado de expansión por nodo
  // =========================================
  expanded = signal<Set<string>>(new Set(['civil'])); // abre "Módulo Civil" por defecto

  // =========================================
  // ✅ Menú filtrado por roles + búsqueda (UI puro)
  // =========================================
  menu = computed<MenuItem[]>(() => {
    const roles = this.roles();
    const q = (this.search.value || '').toLowerCase().trim();

    const filterTree = (nodes: MenuItem[]): MenuItem[] => nodes
      // 1) Filtra por roles
      .filter(n => !n.roles || n.roles.some(r => roles.includes(r)))
      // 2) Aplica búsqueda (en hoja o en padre si cualquier hijo coincide)
      .map(n => {
        if (n.children?.length) {
          const kids = filterTree(n.children);
          const match = n.label.toLowerCase().includes(q);
          return (q ? (match || kids.length) : true) ? { ...n, children: kids } : null as any;
        }
        return (q ? n.label.toLowerCase().includes(q) : true) ? n : null as any;
      })
      .filter(Boolean);

    return filterTree(this.allMenu);
  });

  // =========================================
  // 🔁 Alterna expansión/colapso de un nodo
  // =========================================
  toggle(id: string) {
    this.expanded.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // =========================================
  // 🚪 Logout (cuando tengas AuthService, reemplaza aquí)
  // =========================================
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  // =========================================
  // 📦 Lectura simple de roles desde storage
  // =========================================
  private readRolesFromStorage(): string[] {
    try { return JSON.parse(localStorage.getItem('roles') || '["CIVIL"]'); }
    catch { return ['CIVIL']; }
  }

  // URL del avatar (UI state). Luego vendrá del adapter de auth.
  avatarUrl = signal<string | null>(this.readAvatarUrl());

  // Si falla la carga, volvemos al placeholder
  onAvatarError() {
    this.avatarUrl.set(null);
  }

  // Stub temporal: lee la URL desde localStorage
  private readAvatarUrl(): string | null {
    try {
      return localStorage.getItem('avatarUrl'); // ej: https://i.pravatar.cc/128?img=5
    } catch {
      return null;
    }
  }
}
