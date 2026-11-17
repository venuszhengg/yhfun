import './ActionButton.css';
import rightArrow from './Right.svg';

/** variant: split | solid | text | arrow; tone: amber | olive.
 * Use href for navigation, onClick for actions. */
export default function ActionButton({ children = 'Explore services', caption, arrowContent, variant = 'split', tone = 'amber', href, className = '', disabled = false, type = 'button', ...props }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag {...props} {...(href ? { href: disabled ? undefined : href, 'aria-disabled': disabled || undefined } : { type, disabled })} aria-label={props['aria-label'] ?? (variant === 'arrow' && !props['aria-labelledby'] && typeof children === 'string' ? children : undefined)} className={`yhf-action yhf-action--${variant} yhf-action--${tone} ${className}`}>
      {variant !== 'arrow' && <span className="yhf-action-label">{children}</span>}
      {variant !== 'solid' && <span className="yhf-action-arrow" aria-hidden="true">{arrowContent ?? <img src={rightArrow} width="24" height="24" alt="" />}</span>}
      {caption && <span className="yhf-action-caption">{caption}</span>}
    </Tag>
  );
}
