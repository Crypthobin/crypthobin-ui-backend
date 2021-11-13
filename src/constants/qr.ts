import { QR_LOGO_PATH } from '.'
import { readFileSync } from 'fs'
import { QRErrorCorrectLevel } from 'awesome-qr'

export const QR_GENERATE_OPTION = {
  logoImage: readFileSync(QR_LOGO_PATH),
  logoScale: 0.4,
  logoCornerRadius: 0,
  correctLevel: QRErrorCorrectLevel.H,
  version: 6,
  size: 500,
  colorDark: '#0b508a',
  margin: 1,
  components: {
    data: {
      scale: 0.8
    },
    cornerAlignment: {
      scale: 0.8
    },
    timing: {
      scale: 0.8
    }
  }
}