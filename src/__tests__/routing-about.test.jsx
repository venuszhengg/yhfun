// @vitest-environment-options {"url":"http://localhost/?lang=en&page=about"}

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('About route', () => {
  it('keeps Learn More arrow artwork and links to Services', async () => {
    render(<App />)

    const learnMoreLinks = await screen.findAllByRole('link', { name: 'Learn more' })
    expect(learnMoreLinks).toHaveLength(3)

    for (const link of learnMoreLinks) {
      expect(link).toHaveAttribute('href', '/?lang=en&page=services')
      expect(link.querySelector('.yhf-action-arrow img')).toBeInTheDocument()
    }
  })
})
