import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RouteLoading from '../RouteLoading.jsx'

describe('Route loading state', () => {
  it('announces an accessible page status without the old visible loader', () => {
    const { container } = render(<RouteLoading />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveAccessibleName('Preparing page')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(container.querySelector('.route-loading-mark')).not.toBeInTheDocument()
  })

  it('keeps the form message localized', () => {
    render(<RouteLoading language="zh-Hans" form />)

    expect(screen.getByRole('status')).toHaveAccessibleName('正在准备表单')
  })
})
