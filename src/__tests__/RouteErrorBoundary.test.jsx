import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RouteErrorBoundary } from '../App.jsx'

describe('route loading errors', () => {
  it('offers a reload action instead of leaving a failed route blank', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    function BrokenRoute() {
      throw new Error('Chunk loading failed')
    }

    render(<RouteErrorBoundary language="en"><BrokenRoute /></RouteErrorBoundary>)

    expect(screen.getByRole('alert')).toHaveTextContent('This page could not be loaded.')
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
  })
})
