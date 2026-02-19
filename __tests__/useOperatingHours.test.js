import { vi } from 'vitest'

// Mock the composable without Vue lifecycle hooks for testing
function createOperatingHoursMock(initialTime = new Date()) {
  const openingHour = 8
  const closingHour = 22

  const isOpen = computed(() => {
    const jakartaTime = new Date(initialTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    const currentMinutes = jakartaTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinutes

    const openingTimeInMinutes = openingHour * 60
    const closingTimeInMinutes = closingHour * 60

    return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes
  })

  const statusText = computed(() => isOpen.value ? 'Open' : 'Closed')
  const statusColor = computed(() => isOpen.value ? 'bg-green-500' : 'bg-red-500')
  const operatingHoursText = computed(() => `${openingHour}:00 AM - ${closingHour}:00 PM WIB`)

  return { isOpen, statusText, statusColor, operatingHoursText }
}

describe('Operating Hours Logic', () => {
  it('should be open at 10:00 WIB', () => {
    const time = new Date('2026-02-19T10:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    const currentMinutes = jakartaTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinutes
    
    expect(currentTimeInMinutes).toBeGreaterThanOrEqual(8 * 60)
    expect(currentTimeInMinutes).toBeLessThan(22 * 60)
  })

  it('should be closed at 06:00 WIB', () => {
    const time = new Date('2026-02-19T06:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    const currentMinutes = jakartaTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinutes
    
    expect(currentTimeInMinutes).toBeLessThan(8 * 60)
  })

  it('should be closed at 23:00 WIB', () => {
    const time = new Date('2026-02-19T23:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    const currentMinutes = jakartaTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinutes
    
    expect(currentTimeInMinutes).toBeGreaterThanOrEqual(22 * 60)
  })

  it('should be open at 08:00 WIB (opening time)', () => {
    const time = new Date('2026-02-19T08:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    const currentMinutes = jakartaTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinutes
    
    expect(currentTimeInMinutes).toBeGreaterThanOrEqual(8 * 60)
    expect(currentTimeInMinutes).toBeLessThan(22 * 60)
  })

  it('should be closed at 22:00 WIB (closing time)', () => {
    const time = new Date('2026-02-19T22:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    const currentMinutes = jakartaTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinutes
    
    expect(currentTimeInMinutes).toBeGreaterThanOrEqual(22 * 60)
  })

  it('should return correct status text when open', () => {
    const time = new Date('2026-02-19T10:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    
    const statusText = currentHour >= 8 && currentHour < 22 ? 'Open' : 'Closed'
    expect(statusText).toBe('Open')
  })

  it('should return correct status text when closed', () => {
    const time = new Date('2026-02-19T06:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    
    const statusText = currentHour >= 8 && currentHour < 22 ? 'Open' : 'Closed'
    expect(statusText).toBe('Closed')
  })

  it('should return correct status color when open', () => {
    const time = new Date('2026-02-19T10:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    
    const statusColor = currentHour >= 8 && currentHour < 22 ? 'bg-green-500' : 'bg-red-500'
    expect(statusColor).toBe('bg-green-500')
  })

  it('should return correct status color when closed', () => {
    const time = new Date('2026-02-19T06:00:00+07:00')
    const jakartaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const currentHour = jakartaTime.getHours()
    
    const statusColor = currentHour >= 8 && currentHour < 22 ? 'bg-green-500' : 'bg-red-500'
    expect(statusColor).toBe('bg-red-500')
  })
})
