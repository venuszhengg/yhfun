import { describe, expect, it } from 'vitest'
import { caseStudies, featuredCaseStudies, featuredCaseStudiesZh } from '../caseStudies.js'

describe('shared case-study metadata', () => {
  it('derives featured cards from the published case-study records', () => {
    expect(featuredCaseStudies).toHaveLength(caseStudies.length)
    expect(featuredCaseStudies.map(({ title, image }) => [title, image])).toEqual(
      caseStudies.map(({ cardTitle, image }) => [cardTitle, image]),
    )
    expect(caseStudies.map(({ title }) => title)).toEqual([
      'Make the first step easy',
      'Guiding investment with cost-effective pilots',
      'From campaign planning to delivery',
    ])
  })

  it('keeps the approved Chinese featured card set aligned', () => {
    expect(featuredCaseStudiesZh).toHaveLength(caseStudies.length)
    expect(featuredCaseStudiesZh.every(({ title, description, image }) => title && description && image.alt)).toBe(true)
  })
})
