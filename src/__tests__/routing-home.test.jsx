// @vitest-environment-options {"url":"http://localhost/?lang=en"}

import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('Home route', () => {
  it('renders Home, loads its lower sections, and keeps primary navigation destinations', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Work through the problem/ })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Featured case studies' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Two people working among clothing racks in a boutique' })).toHaveAttribute('loading', 'lazy')

    const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }))
    expect(navigation.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(navigation.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/?lang=en&page=services')
    expect(navigation.getByRole('link', { name: 'Case Studies' })).toHaveAttribute('href', '/?lang=en&page=case-studies')
    expect(navigation.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/?lang=en&page=contact')
  })
})
