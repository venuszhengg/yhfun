// @vitest-environment-options {"url":"http://localhost/?lang=en&page=case-studies"}

import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('Case Studies route', () => {
  it('renders the approved case-study content on a direct route', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Make the first step easy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Guiding investment with cost-effective pilots' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'From campaign planning to delivery' })).toBeInTheDocument()

    const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }))
    expect(navigation.getByRole('link', { name: 'Case Studies' })).toHaveAttribute('aria-current', 'page')
  })
})
