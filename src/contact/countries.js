import { getCountries, getCountryCallingCode } from 'libphonenumber-js/max'

export function getInitialCountry(countries, locales = navigator.languages?.length ? navigator.languages : [navigator.language]) {
  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).region
      if (countries.includes(region)) return region
    } catch {
      continue
    }
  }
  return countries.includes('IE') ? 'IE' : countries[0]
}

export function createCountryOptions(language) {
  const displayNames = new Intl.DisplayNames([language], { type: 'region' })
  return getCountries()
    .map((code) => ({
      code,
      name: displayNames.of(code) || code,
      callingCode: getCountryCallingCode(code),
      flag: String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0))),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function filterCountryOptions(countryOptions, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return countryOptions
  return countryOptions.filter(({ code, name, callingCode }) => (
    `${name} ${code} +${callingCode}`.toLocaleLowerCase().includes(normalizedQuery)
  ))
}
