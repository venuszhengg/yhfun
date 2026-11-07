import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Header from '../Header.jsx'

const items = [
  { id: 'home', href: '/?lang=en', en: 'Home', 'zh-Hans': '首页' },
  { id: 'services', href: '/?lang=en&page=services', en: 'Services', 'zh-Hans': '服务' },
]

describe('Header navigation', () => {
  it('opens the mobile navigation and closes it with Escape, restoring focus', async () => {
    const user = userEvent.setup()
    render(<Header items={items} />)

    const toggle = screen.getByRole('button', { name: 'Open navigation', hidden: true })
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const navigation = screen.getByRole('navigation', { name: 'Main navigation', hidden: true })
    expect(navigation).toHaveClass('is-open')

    await user.keyboard('{Escape}')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })
})
