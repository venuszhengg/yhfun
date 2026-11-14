// @vitest-environment-options {"url":"http://localhost/?lang=en&page=contact"}

import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('Contact route', () => {
  it('loads the contact form and marks Contact as current on a direct route', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Get in touch' })).toBeInTheDocument()

    const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }))
    expect(navigation.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'page')
  })
})
