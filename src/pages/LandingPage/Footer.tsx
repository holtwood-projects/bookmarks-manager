import { Link } from 'react-router-dom'
import { BookMarked, Github, Heart, ExternalLink, ArrowRight } from 'lucide-react'
import { t } from '@/locales'

interface FooterLink {
  labelKey: string
  href: string
  external?: boolean
}

const footerLinks: Record<string, { labelKey: string; links: FooterLink[] }> = {
  product: {
    labelKey: 'footer.product',
    links: [
      { labelKey: 'footer.links.startNow', href: '#/app/upload' },
      { labelKey: 'footer.links.features', href: '#features' },
      { labelKey: 'footer.links.tutorial', href: '#how-it-works' }
    ]
  },
  resources: {
    labelKey: 'footer.resources',
    links: [
      {
        labelKey: 'footer.links.github',
        href: 'https://github.com/holtwood-projects/bookmarks-manager',
        external: true
      },
      {
        labelKey: 'footer.links.demo',
        href: 'https://github.com/holtwood-projects/bookmarks-manager',
        external: true
      },
      {
        labelKey: 'footer.links.feedback',
        href: 'https://github.com/holtwood-projects/bookmarks-manager/issues',
        external: true
      }
    ]
  },
  license: {
    labelKey: 'footer.license',
    links: [
      {
        labelKey: 'footer.links.mitLicense',
        href: 'https://github.com/holtwood-projects/bookmarks-manager/blob/main/LICENSE',
        external: true
      },
      {
        labelKey: 'footer.links.documentation',
        href: 'https://github.com/holtwood-projects/bookmarks-manager#readme',
        external: true
      }
    ]
  }
}

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#') && !href.startsWith('#/')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-background border-t border-border/50">
      {/* CTA Section */}
      <div className="relative py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('footer.cta.title')}
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">{t('footer.cta.description')}</p>
          <Link
            to="/app/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105"
          >
            {t('footer.cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-foreground">Bookmarks Manager</span>
              </div>
              <p className="text-sm text-muted mb-4">{t('footer.brand.description')}</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/holtwood-projects/bookmarks-manager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="font-semibold text-foreground mb-4">{t(section.labelKey)}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.labelKey}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                        >
                          {t(link.labelKey)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => {
                            if (link.href.startsWith('#') && !link.href.startsWith('#/')) {
                              e.preventDefault()
                              scrollToSection(link.href)
                            }
                          }}
                          className="text-sm text-muted hover:text-sky-400 transition-colors"
                        >
                          {t(link.labelKey)}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>by</span>
              <a
                href="https://github.com/holtwood-projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                holtwood-projects
              </a>
            </div>
            <div>© {new Date().getFullYear()} Bookmarks Manager. MIT License.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
