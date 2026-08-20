import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CustomizableComponent } from '../models/default.components';
import styles from './dialog.module.css';
import Icons from './Icons';

interface DialogProps extends CustomizableComponent {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showOverlay?: boolean;
  position?: 'center' | 'top' | 'bottom';
  animation?: 'fade' | 'slide' | 'scale';
  footer?: React.ReactNode;
  header?: React.ReactNode;
  preventScroll?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showOverlay = true,
  position = 'center',
  animation = 'fade',
  footer,
  header,
  preventScroll = true,
  className = '',
  style = {},
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, closeOnEscape, onClose, preventScroll]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  // Handle dialog click to prevent closing when clicking inside dialog
  const handleDialogClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // Focus management
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const dialogContent = (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${
        showOverlay ? styles.withOverlay : ''
      } ${className}`}
      onClick={handleOverlayClick}
      style={style}
    >
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${styles[size]} ${styles[position]} ${styles[animation]}`}
        onClick={handleDialogClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        {/* Header */}
        {(header || title || showCloseButton) && (
          <div className={styles.header}>
            {header || (
              <>
                {title && (
                  <h2 id="dialog-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    <Icons iconType="close" />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  // Use portal to render dialog at the end of body
  return createPortal(dialogContent, document.body);
};

export default Dialog;
