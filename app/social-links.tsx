import { SOCIAL_LINKS } from '@/lib/social';

export function SocialLinks() {
  return (
    <>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
