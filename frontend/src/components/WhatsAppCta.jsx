function WhatsAppCta({ href, children, className = '', variant = 'button' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export default WhatsAppCta;
