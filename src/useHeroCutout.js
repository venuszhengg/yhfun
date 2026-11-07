import { useCallback, useId, useLayoutEffect, useRef } from 'react'

const format = (value) => Number(value.toFixed(2))
const arc = 0.55228475
// Cutout feet flare into the hero's bottom edge over a longer run than the 24px radius so they taper without a pointed tip.
const flareLength = (radius) => radius * 5 / 3

function centeredPath(width, height, left, right, top, radius) {
  const flare = flareLength(radius)
  const leftAtEdge = left <= flare + radius
  const rightAtEdge = width - right <= flare + radius
  left = leftAtEdge ? 0 : left
  right = rightAtEdge ? width : right
  const topRadius = Math.min(radius, (right - left) / 2, height - top)
  const outerRadius = Math.min(radius, width / 2, height / 2)
  const coordinates = (values) => values.map(format).join(' ')
  const path = [
    `M ${coordinates([outerRadius, 0])}`,
    `H ${format(width - outerRadius)}`,
    `C ${coordinates([width - outerRadius + arc * outerRadius, 0, width, outerRadius - arc * outerRadius, width, outerRadius])}`,
  ]

  if (rightAtEdge) {
    path.push(
      `V ${format(top + topRadius)}`,
      `C ${coordinates([width, top + topRadius - arc * topRadius, width - topRadius + arc * topRadius, top, width - topRadius, top])}`,
    )
  } else {
    path.push(
      `V ${format(height - outerRadius)}`,
      `C ${coordinates([width, height - outerRadius + arc * outerRadius, width - outerRadius + arc * outerRadius, height, width - outerRadius, height])}`,
      `H ${format(right + flare)}`,
      `C ${coordinates([right + flare * 0.36, height, right, height - radius / 2, right, height - radius])}`,
      `V ${format(top + topRadius)}`,
      `C ${coordinates([right, top + topRadius - arc * topRadius, right - topRadius + arc * topRadius, top, right - topRadius, top])}`,
    )
  }

  path.push(`H ${format(left + topRadius)}`)

  if (leftAtEdge) {
    path.push(
      `C ${coordinates([left + topRadius - arc * topRadius, top, 0, top + topRadius - arc * topRadius, 0, top + topRadius])}`,
      `V ${format(outerRadius)}`,
      `C ${coordinates([0, outerRadius - arc * outerRadius, outerRadius - arc * outerRadius, 0, outerRadius, 0])}`,
    )
  } else {
    path.push(
      `C ${coordinates([left + topRadius - arc * topRadius, top, left, top + topRadius - arc * topRadius, left, top + topRadius])}`,
      `V ${format(height - radius)}`,
      `C ${coordinates([left, height - radius / 2, left - flare * 0.36, height, left - flare, height])}`,
      `H ${format(outerRadius)}`,
      `C ${coordinates([outerRadius - arc * outerRadius, height, 0, height - outerRadius + arc * outerRadius, 0, height - outerRadius])}`,
      `V ${format(outerRadius)}`,
      `C ${coordinates([0, outerRadius - arc * outerRadius, outerRadius - arc * outerRadius, 0, outerRadius, 0])}`,
    )
  }

  path.push('Z')
  return path.join(' ')
}

function leftAlignedPath(width, height, right, top, radius) {
  const flare = flareLength(radius)
  const rightAtEdge = width - right <= flare + radius
  right = rightAtEdge ? width : right
  const topRadius = Math.min(radius, right / 2, height - top)
  const outerRadius = Math.min(radius, width / 2, height / 2)
  const coordinates = (values) => values.map(format).join(' ')
  const path = [
    `M ${coordinates([outerRadius, 0])}`,
    `H ${format(width - outerRadius)}`,
    `C ${coordinates([width - outerRadius + arc * outerRadius, 0, width, outerRadius - arc * outerRadius, width, outerRadius])}`,
  ]

  if (rightAtEdge) {
    path.push(
      `V ${format(top + topRadius)}`,
      `C ${coordinates([width, top + topRadius - arc * topRadius, width - topRadius + arc * topRadius, top, width - topRadius, top])}`,
    )
  } else {
    path.push(
      `V ${format(height - outerRadius)}`,
      `C ${coordinates([width, height - outerRadius + arc * outerRadius, width - outerRadius + arc * outerRadius, height, width - outerRadius, height])}`,
      `H ${format(right + flare)}`,
      `C ${coordinates([right + flare * 0.36, height, right, height - radius / 2, right, height - radius])}`,
      `V ${format(top + topRadius)}`,
      `C ${coordinates([right, top + topRadius - arc * topRadius, right - topRadius + arc * topRadius, top, right - topRadius, top])}`,
    )
  }

  path.push(
    `H ${format(topRadius)}`,
    `C ${coordinates([topRadius - arc * topRadius, top, 0, top + topRadius - arc * topRadius, 0, top + topRadius])}`,
    `V ${format(outerRadius)}`,
    `C ${coordinates([0, outerRadius - arc * outerRadius, outerRadius - arc * outerRadius, 0, outerRadius, 0])}`,
    'Z',
  )

  return path.join(' ')
}

export function useHeroCutout(alignment = 'center') {
  const elementsRef = useRef({})
  const heroRef = useCallback((node) => { elementsRef.current.hero = node }, [])
  const mediaRef = useCallback((node) => { elementsRef.current.media = node }, [])
  const copyRef = useCallback((node) => { elementsRef.current.copy = node }, [])
  const actionsRef = useCallback((node) => { elementsRef.current.actions = node }, [])
  const pathRef = useCallback((node) => { elementsRef.current.path = node }, [])
  const clipId = `hero-cutout-${useId().replaceAll(':', '')}`

  useLayoutEffect(() => {
    const { hero, media, actions, path } = elementsRef.current
    if (!hero || !media || !actions || !path) {
      throw new Error('Hero cutout requires hero, media, CTA, and clip-path elements.')
    }

    const updatePath = () => {
      const mediaRect = media.getBoundingClientRect()
      let actionsRect = actions.getBoundingClientRect()
      if (!mediaRect.width || !mediaRect.height) return

      const styles = getComputedStyle(hero)
      const clearance = parseFloat(styles.getPropertyValue('--hero-cutout-inset'))
      const radius = parseFloat(styles.getPropertyValue('--radius-hero'))
      if (!Number.isFinite(clearance) || !Number.isFinite(radius)) {
        throw new Error('Hero cutout requires numeric inset and radius tokens.')
      }

      const width = mediaRect.width
      const height = mediaRect.height
      const sideClearance = alignment === 'left'
        ? actionsRect.left - mediaRect.left + clearance + radius * 2
        : clearance + radius * 2
      const maxActionsWidth = format(Math.max(0, width - (alignment === 'left' ? sideClearance : sideClearance * 2)))
      const maxActionsWidthValue = `${maxActionsWidth}px`
      if (actions.style.maxWidth !== maxActionsWidthValue) actions.style.maxWidth = maxActionsWidthValue
      actionsRect = actions.getBoundingClientRect()
      const top = Math.min(height - radius, Math.max(radius, actionsRect.top - mediaRect.top - clearance))
      const right = Math.min(width, actionsRect.right - mediaRect.left + clearance)
      const left = Math.max(0, actionsRect.left - mediaRect.left - clearance)
      const pathData = alignment === 'left'
        ? leftAlignedPath(format(width), format(height), format(right), format(top), radius)
        : centeredPath(format(width), format(height), format(left), format(right), format(top), radius)

      path.setAttribute('d', pathData)
    }

    const resizeObserver = new ResizeObserver(updatePath)
    ;[hero, media, elementsRef.current.copy, actions].filter(Boolean).forEach((element) => resizeObserver.observe(element))
    window.addEventListener('resize', updatePath)
    updatePath()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePath)
    }
  }, [alignment])

  return [heroRef, mediaRef, copyRef, actionsRef, pathRef, clipId]
}
