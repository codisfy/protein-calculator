import { render, screen, act } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders a heading', async () => {
    
    await act( async () => render(<Home />));

    const heading = screen.getByRole('heading', {
      name: "Protein Value Calculator",
    })

    expect(heading).toBeInTheDocument()
  })
})