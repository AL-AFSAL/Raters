import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AboutPage', () => {
  it('renders the main heading', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('Welcome to Raters')).toBeInTheDocument();
  });

  it('displays the developer introduction section', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('Meet the Developer')).toBeInTheDocument();
    expect(screen.getByText(/Hi, I'm MOHAMED AL AFSAL/)).toBeInTheDocument();
  });

  it('shows all feature sections', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('What Makes Raters Special')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Database')).toBeInTheDocument();
    expect(screen.getByText('Smart Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Vibrant Community')).toBeInTheDocument();
  });

  it('displays technical excellence section', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('Built with Technical Excellence')).toBeInTheDocument();
    expect(screen.getByText('Modern Stack')).toBeInTheDocument();
    expect(screen.getByText('Real-time Updates')).toBeInTheDocument();
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
  });

  it('includes call-to-action buttons', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Start Rating')).toBeInTheDocument();
  });

  it('renders responsively', () => {
    const { container } = renderWithRouter(<AboutPage />);
    const sections = container.querySelectorAll('section');
    sections.forEach(section => {
      expect(section.className).toMatch(/py-(16|20)/);
    });
  });

  it('has accessible links', () => {
    renderWithRouter(<AboutPage />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });
});