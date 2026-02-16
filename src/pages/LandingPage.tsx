import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import Cover from '../components/Cover';
import './LandingPage.css';
import { ThemeToggle } from '@/components/ThemeToggle';
import Antigravity from '@/components/ui/Antigravity';

export default function LandingPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [coverFinished, setCoverFinished] = useState(false);

  return (
    <>
      {!coverFinished && <Cover onComplete={() => setCoverFinished(true)} />}
      <div className="landing-page">
        <nav className="navbar">
          <div className="logo-pecitalanding">Sha8lny</div>
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">Categories</a>
            <a href="#">Feature</a>
            <a href="#">About us !</a>
            <a href="#">FAQ</a>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            {profile.userId ? (
              <button className="btn-login" onClick={() => navigate('/dashboard')}>Dashboard</button>
            ) : (
              <>
                <button className="btn-login" onClick={() => navigate('/auth')}>Login</button>
                <button className="btn-register" onClick={() => navigate('/auth?mode=signup')}>Register</button>
              </>
            )}
          </div>
        </nav>

        <section className="hero">
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            <Antigravity
              count={300}
              magnetRadius={3}
              ringRadius={3.5}
              waveSpeed={0.4}
              waveAmplitude={1}
              particleSize={3.5}
              lerpSpeed={0.05}
              colors={[
                '#7C3AED', // Violet (500)
                '#9333EA', // Purple (600)
                '#EC4899', // Pink (500)
                '#E11D48', // Rose (600)
                '#3B82F6', // Blue (500)
                '#0891B2', // Cyan (600)
                '#F59E0B', // Amber (500)
                '#EA580C', // Orange (600)
                '#53599A', // Brand Primary
              ]}
              autoAnimate
              particleVariance={2}
              rotationSpeed={5}
              depthFactor={1.5}
              pulseSpeed={0}
              particleShape="capsule"
              fieldStrength={40}
            />
          </div>
          <div className="hero-content relative z-10">
            <h1>Start your <span className="highlight-text">Training</span><br />Journey With Us !</h1>
            <p>Platform afford a training Opportunities in Different Fields, Gain a Work experience and certification to add it to Your CV.</p>
            <button className="btn-primary" onClick={() => navigate('/auth?mode=signup')}>Download Now</button>
            <button className="btn-secondary">Watch Video</button>
          </div>
          <div className="hero-image-placeholder">
            <div className="mobile-screen-content">
              <h1 className="logo-pecita">Sha8lny</h1>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Why Choose Us</h2>
          <p className="subtitle">Our membership management software provides full automation of membership</p>

          <div className="feature-cards">
            <div className="card">
              <div className="icon">👥</div>
              <h3>Membership Organisations</h3>
              <p>Our membership management software provides full automation of membership renewals and payments</p>
            </div>
            <div className="card">
              <div className="icon">✅</div>
              <h3>Verified Internship</h3>
              <p>Our membership management software provides full automation of membership renewals and payments</p>
            </div>
            <div className="card">
              <div className="icon">🎓</div>
              <h3>Mange Your Training</h3>
              <p>Our membership management software provides full automation of membership renewals and payments</p>
            </div>
          </div>
        </section>

        <section className="partners-strip">
          <div className="partners-title">More than 40+ Companies partner</div>
          <div className="partners-logos-container">
            <div className="partners-logos">
              <span>We</span>
              <span>Coursera</span>
              <span>Udemy</span>
              <span>Udemy</span>
              {/* Duplicated for smooth scrolling */}
              <span>We</span>
              <span>Coursera</span>
              <span>Udemy</span>
              <span>Udemy</span>
              <span>Udemy</span>
              <span>We</span>
              <span>Coursera</span>
              <span>Udemy</span>
              <span>Udemy</span>
              {/* Extra Duplication for wide screens */}
              <span>We</span>
              <span>Coursera</span>
              <span>Udemy</span>
              <span>Udemy</span>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <h2>Categories</h2>
          <div className="category-cards">
            <div className="category-card">
              <span className="category-name">Computer Science</span>
            </div>
            <div className="category-card">
              <span className="category-name">Communication</span>
            </div>
            <div className="category-card">
              <span className="category-name">Mechatronics</span>
            </div>
            <div className="category-card">
              <span className="category-name">Industrial</span>
            </div>
          </div>
        </section>

        <section className="app-showcase">
          <div className="app-showcase-content">
            <div className="app-text-column">
              <h2>Discover, Apply, and Connecting to Real-World <span className="highlight-text-blue">Opportunities.</span></h2>
              <ul>
                <li>Explore verified training programs from trusted companies.</li>
                <li>Apply easily with a simple and fast process.</li>
                <li>Track your progress and completed trainings in one place.</li>
                <li>Get real-time updates and notifications about your applications.</li>
                <li>Build practical skills that match real job market needs.</li>
              </ul>
            </div>
            <div className="app-image-column">
              {/* CSS-only Phone Mockup */}
              <div className="phone-mockup">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  {/* Simplified UI representation */}
                  <div className="app-header">
                    <span>9:41</span>
                    <div className="app-status-icons">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div className="app-nav">
                    <span>=</span>
                    <span>Opportunities</span>
                    <span>Q</span>
                  </div>
                  <div className="app-tabs">
                    <span className="active">Work</span>
                    <span>Internship</span>
                  </div>
                  <div className="app-filters">
                    <span className="pill active">🔥 All</span>
                    <span className="pill">✨ Newest</span>
                  </div>
                  <p className="results-count">5 internship found</p>

                  <div className="app-card">
                    <div className="app-card-header">
                      <div className="app-icon-box">💼</div>
                      <div>
                        <h4>UI/UX Designer at Element Three</h4>
                      </div>
                    </div>
                    <div className="app-tags">
                      <span>Mobile Design</span>
                      <span>3D Design</span>
                    </div>
                    <div className="app-meta">
                      <span>🕒 1-4 weeks</span>
                      <span className="price">💲 1,000EGP</span>
                    </div>
                    <button className="app-btn">View Details</button>
                  </div>

                  <div className="app-card">
                    <div className="app-card-header">
                      <div className="app-icon-box">💻</div>
                      <div>
                        <h4>Frontend Engineering at Element Three</h4>
                      </div>
                    </div>
                    <div className="app-tags">
                      <span>HTML</span>
                      <span>CSS</span>
                    </div>
                    <div className="app-meta">
                      <span>🕒 1-6 Months</span>
                      <span className="price">💲 4,000EGP</span>
                    </div>
                    <button className="app-btn">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-columns">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Oppourtinties</a>
                <a href="#">Work Job</a>
                <a href="#">fegure</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Blog/ Articles</a>
                <a href="#">Guides</a>
                <a href="#">Help</a>
                <a href="#">feguare</a>
              </div>
              <div className="footer-column">
                <h4>Category</h4>
                <a href="#">Comm</a>
                <a href="#">Meac</a>
                <a href="#">indust</a>
                <a href="#">Computer</a>
              </div>
              <div className="footer-column">
                <h4>Connect</h4>
                <a href="#">FAQ</a>
                <a href="#">About Us</a>
                <a href="#">Email</a>
                <a href="#">Help Center</a>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-logo">Sha8lny</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
