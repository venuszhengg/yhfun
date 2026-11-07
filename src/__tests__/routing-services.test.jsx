// @vitest-environment-options {"url":"http://localhost/?lang=en&page=services"}

import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('Services route', () => {
  it('renders directly from the page query and marks Services as current', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: /Find the support/ })).toBeInTheDocument()

    const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }))
    expect(navigation.getByRole('link', { name: 'Services' })).toHaveAttribute('aria-current', 'page')
  })
})
