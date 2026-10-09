import React, { useEffect, useRef, useState } from 'react';

// SVG Icon Helpers
const ICONS = {
  edit: (
    <svg className="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
  delete: (
    <svg className="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  ),
  merge: (
    <svg className="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  ),
  incoming: (
    <svg className="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>
  ),
  check: (
    <svg className="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  cancel: (
    <svg className="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" x2="9" y1="9" y2="15" />
      <line x1="9" x2="15" y1="9" y2="15" />
    </svg>
  ),
  chevron: (
    <svg className="s-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
};

const ICONS_HTML = {
  edit: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  delete: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  merge: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>`,
  incoming: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>`,
  check: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  cancel: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`,
  chevron: `<svg class="s-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
};

/* ==========================================================================
   Web Components Registration: <s-button> and <s-menu>
   Follows Shopify Polaris web components specification:
   <s-button commandFor="menu-id">Actions</s-button>
   <s-menu id="menu-id" accessibilityLabel="Actions">
     <s-button icon="edit">Edit</s-button>
     <s-button icon="delete" tone="critical">Delete</s-button>
   </s-menu>
   ========================================================================== */

if (typeof window !== 'undefined' && !window.customElements.get('s-button')) {
  // Global active menu tracker
  let activeMenu = null;

  const closeActiveMenu = () => {
    if (activeMenu) {
      activeMenu.close();
      activeMenu = null;
    }
  };

  window.addEventListener('pointerdown', (e) => {
    if (activeMenu) {
      const isInsideMenu = activeMenu.contains(e.target);
      const isTrigger = e.target.closest && (
        e.target.closest('s-button[commandfor]') || 
        e.target.closest('s-button[commandFor]')
      );
      if (!isInsideMenu && !isTrigger) {
        closeActiveMenu();
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeActiveMenu();
    }
  });

  // Custom Element: <s-menu>
  class SMenuElement extends HTMLElement {
    connectedCallback() {
      this.setAttribute('role', 'menu');
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '-1');
      }
      const label = this.getAttribute('accessibilitylabel') || this.getAttribute('accessibilityLabel');
      if (label) {
        this.setAttribute('aria-label', label);
      }
      this.classList.add('s-menu-popover');
    }

    open(triggerEl) {
      closeActiveMenu();
      activeMenu = this;
      this.classList.add('s-menu-open');
      this.style.display = 'flex';

      if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        const menuWidth = this.offsetWidth || 190;
        
        let top = rect.bottom + 6;
        let left = rect.right - menuWidth;

        // Viewport bounds detection
        if (left < 12) {
          left = 12;
        }
        if (left + menuWidth > window.innerWidth - 12) {
          left = window.innerWidth - menuWidth - 12;
        }
        if (top + this.offsetHeight > window.innerHeight - 12) {
          top = rect.top - (this.offsetHeight || 140) - 6;
        }

        this.style.position = 'fixed';
        this.style.top = `${top}px`;
        this.style.left = `${left}px`;
        this.style.zIndex = '9999';
      }
    }

    close() {
      this.classList.remove('s-menu-open');
      this.style.display = 'none';
      if (activeMenu === this) {
        activeMenu = null;
      }
    }

    toggle(triggerEl) {
      if (this.classList.contains('s-menu-open')) {
        this.close();
      } else {
        this.open(triggerEl);
      }
    }
  }

  // Custom Element: <s-button>
  class SButtonElement extends HTMLElement {
    connectedCallback() {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');

      const commandFor = this.getAttribute('commandfor') || this.getAttribute('commandFor');
      const isInsideMenu = this.closest('s-menu');

      if (commandFor) {
        // Trigger button
        this.classList.add('s-button-trigger');
        this.setAttribute('aria-haspopup', 'menu');
        this.setAttribute('aria-expanded', 'false');

        // Append chevron if not already present
        if (!this.querySelector('.s-chevron')) {
          const chevronSpan = document.createElement('span');
          chevronSpan.innerHTML = ICONS_HTML.chevron;
          this.appendChild(chevronSpan.firstElementChild);
        }

        this.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetMenu = document.getElementById(commandFor);
          if (targetMenu && typeof targetMenu.toggle === 'function') {
            targetMenu.toggle(this);
            const isOpen = targetMenu.classList.contains('s-menu-open');
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          }
        });
      } else if (isInsideMenu) {
        // Menu item inside <s-menu>
        this.classList.add('s-button-item');
        const tone = this.getAttribute('tone');
        if (tone === 'critical') {
          this.classList.add('s-tone-critical');
        }

        const iconName = this.getAttribute('icon');
        if (iconName && ICONS_HTML[iconName] && !this.querySelector('.s-icon')) {
          const iconSpan = document.createElement('span');
          iconSpan.innerHTML = ICONS_HTML[iconName];
          this.prepend(iconSpan.firstElementChild);
        }

        this.addEventListener('click', () => {
          const parentMenu = this.closest('s-menu');
          if (parentMenu && typeof parentMenu.close === 'function') {
            parentMenu.close();
          }
        });
      }

      // Keyboard accessibility (Enter / Space)
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
  }

  window.customElements.define('s-menu', SMenuElement);
  window.customElements.define('s-button', SButtonElement);
}

/* ==========================================================================
   React Native Component Equivalents (for JSX convenience & direct usage)
   ========================================================================== */

export function SButton({
  commandFor,
  icon,
  tone,
  children,
  onClick,
  className = '',
  ...props
}) {
  const isTrigger = Boolean(commandFor);
  const isCritical = tone === 'critical';

  const handleClick = (e) => {
    if (isTrigger) {
      e.stopPropagation();
      const menu = document.getElementById(commandFor);
      if (menu && typeof menu.toggle === 'function') {
        menu.toggle(e.currentTarget);
      }
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <s-button
      commandFor={commandFor}
      commandfor={commandFor}
      icon={icon}
      tone={tone}
      class={`s-button ${isTrigger ? 's-button-trigger' : 's-button-item'} ${isCritical ? 's-tone-critical' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {icon && ICONS[icon]}
      <span>{children}</span>
      {isTrigger && ICONS.chevron}
    </s-button>
  );
}

export function SMenu({
  id,
  accessibilityLabel = 'Pilihan Aksi',
  children,
  className = '',
  ...props
}) {
  return (
    <s-menu
      id={id}
      accessibilityLabel={accessibilityLabel}
      accessibilitylabel={accessibilityLabel}
      class={`s-menu-popover ${className}`}
      {...props}
    >
      {children}
    </s-menu>
  );
}

export default { SButton, SMenu };
