import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/marketplace/Navbar';
import { MarketplaceSidebar } from '@/components/marketplace/MarketplaceSidebar';
import { HeroBanner } from '@/components/marketplace/HeroBanner';
import { ProductRow } from '@/components/marketplace/ProductRow';
import { LiveChatWidget } from '@/components/marketplace/LiveChatWidget';
import { products, sections } from '@/lib/marketplaceData';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <MarketplaceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-56' : 'lg:pl-16'}`}>
        <HeroBanner />
        <div className="py-4">
          {sections.map(section => {
            const filtered = products.filter(section.filter);
            return (
              <ProductRow
                key={section.title}
                title={section.title}
                products={filtered}
              />
            );
          })}
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="mx-auto max-w-[1440px] px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Platform</h4>
                <div className="space-y-2">
                  <Link to="/search" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Browse Apps</Link>
                  <Link to="/search" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
                  <Link to="/pricing" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                  <Link to="/enterprise" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Enterprise</Link>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Resources</h4>
                <div className="space-y-2">
                  <Link to="/docs" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                  <Link to="/api" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">API Reference</Link>
                  <Link to="/tutorials" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Tutorials</Link>
                  <Link to="/blog" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Company</h4>
                <div className="space-y-2">
                  <Link to="/about" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
                  <Link to="/careers" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
                  <Link to="/partners" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
                  <Link to="/contact" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Legal</h4>
                <div className="space-y-2">
                  <Link to="/privacy" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                  <Link to="/terms" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                  <Link to="/security" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Security</Link>
                  <Link to="/compliance" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Compliance</Link>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-xs text-muted-foreground">© 2026 Software Vala. All rights reserved. Ultra Premium Software Marketplace.</p>
            </div>
          </div>
        </footer>
      </div>
      <LiveChatWidget />
    </div>
  );
};

export default HomePage;
