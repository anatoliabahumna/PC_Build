import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App experience', () => {
  it('renders hero stats and planner', () => {
    render(<App />);
    expect(screen.getByText(/Ultimate PC Build Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Build Planner/i)).toBeVisible();
    expect(screen.getByLabelText('build-notes')).toBeInTheDocument();
  });

  it('swaps build presets and updates metadata', () => {
    render(<App />);
    expect(screen.getByText('Creator Studio')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Esports Velocity'));
    expect(screen.getByText('Esports Velocity')).toBeInTheDocument();
    expect(screen.getByText(/Latency tuned/i)).toBeInTheDocument();
  });

  it('filters component library and adds a part', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText('category-GPU'));
    expect(screen.getByText('RTX 4080 Super')).toBeInTheDocument();
    expect(screen.queryByText('Ryzen 9 7950X3D')).not.toBeInTheDocument();
    const addButton = screen.getByLabelText('add-gpu-01');
    fireEvent.click(addButton);
    expect(screen.getAllByLabelText(/part-/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Parts onboard/i).textContent).toContain('9');
  });

  it('records brainstorm ideas', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Next idea/i);
    fireEvent.change(input, { target: { value: 'Cable map draft' } });
    fireEvent.click(screen.getByLabelText('add-idea'));
    expect(screen.getAllByLabelText('idea-item')[0]).toHaveTextContent('Cable map draft');
  });

  it('ignores blank brainstorm submissions', () => {
    render(<App />);
    const initialIdeas = screen.getAllByLabelText('idea-item').length;
    fireEvent.click(screen.getByLabelText('add-idea'));
    expect(screen.getAllByLabelText('idea-item').length).toBe(initialIdeas);
  });

  it('starts a return flow', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText('return-order-1001'));
    expect(screen.getByText(/Return initiated/)).toBeInTheDocument();
    expect(screen.getByLabelText('order-order-1001')).toHaveTextContent('Returned');
  });
});
