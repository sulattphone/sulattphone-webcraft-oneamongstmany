import { describe, expect, it } from 'vitest'
import women from './women3d'

describe('women data', () => {
  it('contains the complete original sequence', () => {
    expect(women).toHaveLength(18)
    expect(women[0].name).toBe('Adele Goldstine')
    expect(women[women.length - 1].name).toBe('Coraline Ada Ehmke')
  })

  it('uses bounded numeric values and secure external URLs', () => {
    for (const woman of women) {
      expect(woman.year).toBeGreaterThan(1900)
      expect(woman.backlinks).toBeGreaterThanOrEqual(0)
      expect(woman.references).toBeGreaterThanOrEqual(0)
      expect(new URL(woman.url).protocol).toBe('https:')
      if (woman.birthYear !== null) {
        expect(woman.birthYear).toBeLessThanOrEqual(woman.year)
      }
    }
  })
})
