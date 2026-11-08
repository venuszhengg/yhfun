import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RouteLoading from '../RouteLoading.jsx'

describe('Route loading state', () => {
  it('announces an accessible branded page status', () => {
    render(<RouteLoading />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Loading page…')
    expect(screen.getByText('Y')).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the form message localized', () => {
    render(<RouteLoading language="zh-Hans" form />)

    expect(screen.getByRole('status')).toHaveTextContent('正在加载表单…')
  })
})
