import { useCallback, useId, useLayoutEffect, useRef } from 'react'

const format = (value) => Number(value.toFixed(2))
const arc = 0.55228475

function centeredPath(width, height, left, right, top, radius, edgeGap, tightCorners = false) {
  const leftAtEdge = edgeGap > 0 ? left < edgeGap : left <= radius * 2
  const rightAtEdge = edgeGap > 0 ? width - right < edgeGap : width - right <= radius * 2
  left = leftAtEdge ? 0 : left
  right = rightAtEdge ? width : right
  const bottomRadius = tightCorners
    ? Math.min(radius, left / 2, (width - right) / 2)
    : edgeGap > 0
    ? Math.min(radius, Math.max(0, left - edgeGap), Math.max(0, width - right - edgeGap))
    : radius
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
      `V ${format(height - bottomRadius)}`,
      `C ${coordinates([width, height - bottomRadius + arc * bottomRadius, width - bottomRadius + arc * bottomRadius, height, width - bottomRadius, height])}`,
      `H ${format(right + bottomRadius)}`,
      `C ${coordinates([right + bottomRadius - arc * bottomRadius, height, right, height - bottomRadius + arc * bottomRadius, right, height - bottomRadius])}`,
      `V ${format(top + topRadius)}`,
      `C ${coordinates([right, top + topRadius - arc * topRadius, right - topRadius + arc * topRadius, top, right - topRadius, top])}`,
    )
  }

  path.push(`H ${format(left + topRadius)}`)

  if (leftAtEdge) {
    path.push(
      `A ${format(topRadius)} ${format(topRadius)} 0 0 0 0 ${format(top + topRadius)}`,
      `V ${format(outerRadius)}`,
      `C ${coordinates([0, outerRadius - arc * outerRadius, outerRadius - arc * outerRadius, 0, outerRadius, 0])}`,
    )
  } else {
    path.push(
      `A ${format(topRadius)} ${format(topRadius)} 0 0 0 ${format(left)} ${format(top + topRadius)}`,
      `V ${format(height - bottomRadius)}`,
      `C ${coordinates([left, height - bottomRadius + arc * bottomRadius, left - bottomRadius + arc * bottomRadius, height, left - bottomRadius, height])}`,
      `H ${format(tightCorners ? bottomRadius : outerRadius)}`,
      `C ${tightCorners
        ? coordinates([bottomRadius - arc * bottomRadius, height, 0, height - bottomRadius + arc * bottomRadius, 0, height - bottomRadius])
        : coordinates([outerRadius - arc * outerRadius, height, 0, height - outerRadius + arc * outerRadius, 0, height - outerRadius])}`,
      `V ${format(outerRadius)}`,
      `C ${coordinates([0, outerRadius - arc * outerRadius, outerRadius - arc * outerRadius, 0, outerRadius, 0])}`,
    )
  }

  path.push('Z')
  return path.join(' ')
}

function leftAlignedPath(width, height, right, top, radius) {
  const rightAtEdge = width - right <= radius * 2
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
      `H ${format(right + radius)}`,
      `C ${coordinates([right + radius - arc * radius, height, right, height - radius + arc * radius, right, height - radius])}`,
      `V ${format(top + topRadius)}`,
      `C ${coordinates([right, top + topRadius - arc * topRadius, right - topRadius + arc * topRadius, top, right - topRadius, top])}`,
    )
  }

  path.push(
    `H ${format(topRadius)}`,
    `A ${format(topRadius)} ${format(topRadius)} 0 0 0 0 ${format(top + topRadius)}`,
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
      const edgeGapValue = styles.getPropertyValue('--hero-cutout-edge-gap').trim()
      const edgeGap = edgeGapValue ? parseFloat(edgeGapValue) : 0
      const enclosed = styles.getPropertyValue('--hero-cutout-enclosed').trim() === '1'
      if (!Number.isFinite(clearance) || !Number.isFinite(radius) || !Number.isFinite(edgeGap)) {
        throw new Error('Hero cutout requires numeric inset and radius tokens.')
      }

      const width = mediaRect.width
      const height = mediaRect.height
      const sideClearance = enclosed ? clearance : alignment === 'left'
        ? actionsRect.left - mediaRect.left + clearance + radius * 2
        : clearance + (edgeGap > 0 ? edgeGap : radius * 2)
      const maxActionsWidth = format(Math.max(0, width - (alignment === 'left' && !enclosed ? sideClearance : sideClearance * 2)))
      const maxActionsWidthValue = `${maxActionsWidth}px`
      if (actions.style.maxWidth !== maxActionsWidthValue) actions.style.maxWidth = maxActionsWidthValue
      actionsRect = actions.getBoundingClientRect()
      const top = Math.min(height - radius, Math.max(radius, actionsRect.top - mediaRect.top - clearance))
      const right = Math.min(width, actionsRect.right - mediaRect.left + clearance)
      const left = Math.max(0, actionsRect.left - mediaRect.left - clearance)
      const pathData = alignment === 'left' && !enclosed
        ? leftAlignedPath(format(width), format(height), format(right), format(top), radius)
        : centeredPath(format(width), format(height), format(left), format(right), format(top), radius, enclosed ? 0.01 : edgeGap, enclosed)

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
