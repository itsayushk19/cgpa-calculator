
interface CgpaBits {
  current: number
  predicted: number
  future: number
}

let cgpaBits: CgpaBits = { current: 0, predicted: 0, future: 0 }

export function stashCgpa(v: CgpaBits) {
  cgpaBits = v
}

export function readCgpa(): CgpaBits {
  return cgpaBits
}
