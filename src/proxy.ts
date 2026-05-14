import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const password = process.env.BASIC_AUTH_PASSWORD
  // Si pas de mot de passe configuré, on laisse passer (dev local)
  if (!password) return NextResponse.next()

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    const encoded = authHeader.slice(6)
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    // format: "username:password" — on ne vérifie que le mot de passe
    const colonIdx = decoded.indexOf(':')
    const pwd = decoded.slice(colonIdx + 1)
    if (pwd === password) return NextResponse.next()
  }

  return new NextResponse('Accès restreint — InvestHub', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="InvestHub"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
