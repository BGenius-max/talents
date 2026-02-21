import jwt, { JwtPayload } from 'jsonwebtoken'

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */

export type Role = 'admin' | 'staff' | 'member'

export interface SessionUser {
  user_id: number
  email: string
  role: Role
  first_name: string // Added
  photo: string | null // Added
}

/* ────────────────────────────────────────────────
   Internal: safely read JWT secret
──────────────────────────────────────────────── */

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    throw new Error(
      'JWT_SECRET is missing.\n' +
      'Create .env.local and add:\n' +
      'JWT_SECRET=your-very-long-random-secret\n' +
      'Then restart the dev server.'
    )
  }

  return secret
}

/* ────────────────────────────────────────────────
   JWT helpers
──────────────────────────────────────────────── */

/**
 * Sign a JWT for a logged-in user
 */
export function signToken(user: SessionUser): string {
  const secret = requireJwtSecret()

  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      first_name: user.first_name, // Added to payload
      photo: user.photo,           // Added to payload
    },
    secret,
    {
      expiresIn: '7d',
      algorithm: 'HS256',
    }
  )
}

/**
 * Verify JWT and return session user
 */
export function verifyToken(token: string): SessionUser | null {
  try {
    const secret = requireJwtSecret()
    const decoded = jwt.verify(token, secret) as JwtPayload

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      typeof decoded.user_id === 'number' &&
      typeof decoded.email === 'string' &&
      ['admin', 'staff', 'member'].includes(decoded.role as string)
    ) {
      return {
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role as Role,
        first_name: decoded.first_name || '', // Extracted from token
        photo: decoded.photo || null,         // Extracted from token
      }
    }

    return null
  } catch {
    return null
  }
}

/* ────────────────────────────────────────────────
   Authorization helper
──────────────────────────────────────────────── */

export function requireRole(
  user: SessionUser | null,
  allowedRoles: Role[]
): asserts user is SessionUser {
  if (!user) {
    throw new Error('Authentication required')
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `Unauthorized. Required role(s): ${allowedRoles.join(', ')}`
    )
  }
}