import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { contenido, tipo, nombre } = await request.json()

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres un experto en facturas electrónicas de México (CFDI) y Costa Rica (Hacienda).

Extraé los siguientes datos de esta factura y respondé SOLO con un JSON válido, sin texto adicional, sin markdown, sin backticks:

{
  "numero_factura": "string",
  "emisor": "string (nombre del emisor/vendedor)",
  "receptor": "string (nombre del receptor/comprador)",
  "monto": number (monto total como número sin símbolos),
  "moneda": "MXN o CRC o USD",
  "fecha_emision": "YYYY-MM-DD",
  "fecha_vencimiento": "YYYY-MM-DD o null",
  "pais": "Mexico o Costa Rica"
}

Archivo: ${nombre}
Contenido:
${contenido.substring(0, 8000)}`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      })
    }
  )

  const data = await response.json()
  
  try {
    const texto = data.candidates[0].content.parts[0].text
    const clean = texto.replace(/```json|```/g, '').trim()
    return NextResponse.json(JSON.parse(clean))
  } catch {
    return NextResponse.json({
      numero_factura: 'No encontrado',
      emisor: 'No encontrado',
      receptor: 'No encontrado',
      monto: 0,
      moneda: 'MXN',
      fecha_emision: null,
      fecha_vencimiento: null,
      pais: 'No determinado'
    })
  }
}
