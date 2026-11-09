import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LanguageSwitcher from '../LanguageSwitcher.jsx'

afterEach(() => {
  vi.useRealTimers()
})

describe.each(['header', 'footer'])('LanguageSwitcher in the %s', (placement) => {
  it.each([
    ['en', 'English', 'Simplified Chinese', 'zh-Hans'],
    ['zh-Hans', '简体中文', '英语', 'en'],
  ])('slides from %s before notifying the route handler', (language, currentName, nextName, nextLanguage) => {
    vi.useFakeTimers()
    const onLanguageChange = vi.fn()
    render(<LanguageSwitcher placement={placement} language={language} onLanguageChange={onLanguageChange} />)

    const group = screen.getByRole('group')
    const current = within(group).getByRole('button', { name: currentName })
    const next = within(group).getByRole('button', { name: nextName })
    expect(current).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(current)
    expect(onLanguageChange).not.toHaveBeenCalled()

    fireEvent.click(next)
    fireEvent.click(next)
    expect(next).toHaveAttribute('aria-pressed', 'true')
    expect(current).toHaveAttribute('aria-pressed', 'false')
    expect(group).toHaveAttribute('data-selected', nextLanguage)
    act(() => vi.advanceTimersByTime(279))
    expect(onLanguageChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onLanguageChange).toHaveBeenCalledTimes(1)
    expect(onLanguageChange).toHaveBeenCalledWith(nextLanguage)
  })

  it('cancels a pending change when the original language is selected again', () => {
    vi.useFakeTimers()
    const onLanguageChange = vi.fn()
    render(<LanguageSwitcher placement={placement} onLanguageChange={onLanguageChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Simplified Chinese' }))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    act(() => vi.advanceTimersByTime(280))
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(onLanguageChange).not.toHaveBeenCalled()
  })
})

it('cleans up pending navigation on unmount or a language prop change', () => {
  vi.useFakeTimers()
  const onLanguageChange = vi.fn()
  const { rerender, unmount } = render(<LanguageSwitcher onLanguageChange={onLanguageChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Simplified Chinese' }))
  rerender(<LanguageSwitcher language="zh-Hans" onLanguageChange={onLanguageChange} />)
  act(() => vi.advanceTimersByTime(280))
  expect(onLanguageChange).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: '英语' }))
  unmount()
  act(() => vi.advanceTimersByTime(280))
  expect(onLanguageChange).not.toHaveBeenCalled()
})

it('navigates immediately when reduced motion is enabled', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true })
  const onLanguageChange = vi.fn()
  render(<LanguageSwitcher onLanguageChange={onLanguageChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Simplified Chinese' }))
  expect(onLanguageChange).toHaveBeenCalledOnce()
  expect(onLanguageChange).toHaveBeenCalledWith('zh-Hans')
})
