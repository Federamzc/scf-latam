import { NextRequest, NextResponse } from 'next/server'
import { emailFacturaNueva, emailFacturaAprobada, emailFacturaRechazada, emailCreditoAprobado } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, data } = body

  try {
    switch (type) {
      case 'factura_nueva':
        await emailFacturaNueva(data)
        break
      case 'factura_aprobada':
        await emailFacturaAprobada(data)
        break
      case 'factura_rechazada':
        await emailFacturaRechazada(data)
        break
      case 'credito_aprobado':
        await emailCreditoAprobado(data)
        break
      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
