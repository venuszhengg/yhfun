import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from '../Footer.jsx'

describe.each([
  ['en', 'Explore', 'Case Studies'],
  ['zh-Hans', '探索', '案例研究'],
])('Footer in %s', (language, group, label) => {
  it('links to Case Studies and retains the other footer controls', () => {
    render(<Footer language={language} href={(route = '') => `/?lang=${language}${route ? `&page=${route}` : ''}`} year={2026} />)

    expect(within(screen.getByRole('navigation', { name: group })).getByRole('link', { name: label }))
      .toHaveAttribute('href', `/?lang=${language}&page=case-studies`)
    expect(screen.getByRole('button', { name: /info@yhfunhq.com/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/@yishanthinks')
  })
})
