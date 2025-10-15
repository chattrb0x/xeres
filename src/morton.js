// Spreads bits of an 8-bit number to every other bit position
// Example: 0b1011 -> 0b01000001
function spreadBits(x) {
    x = x & 0xFF // Ensure 8-bit input
    
    // Start with 8 bits: --------76543210
    x = (x | (x << 4)) & 0x0F0F  // ----7654----3210
    x = (x | (x << 2)) & 0x3333  // --76--54--32--10
    x = (x | (x << 1)) & 0x5555  // -7-6-5-4-3-2-1-0
    return x
}

// Compacts bits from every other position back to 8 bits
// Inverse of spreadBits
function compactBits(x) {
    x = x & 0x5555 // Keep only odd bit positions
    x = (x | (x >>> 1)) & 0x3333
    x = (x | (x >>> 2)) & 0x0F0F
    x = (x | (x >>> 4)) & 0x00FF
    return x
}

// Converts signed 8-bit integer to unsigned (offset by 128)
// Maps range [-128, 127] to [0, 255]
function signedToUnsigned(value) {
    return (value + 128) & 0xFF
}

// Converts unsigned 8-bit integer back to signed
// Maps range [0, 255] to [-128, 127]
function unsignedToSigned(value) {
    return value - 128
}

// Encodes 2D coordinates (x, y) into a Morton code (Z-order curve)
// Supports signed coordinates with (0, 0) at center
function mortonEncode(x, y) {
    const ux = signedToUnsigned(x)
    const uy = signedToUnsigned(y)
    return (spreadBits(uy) << 1) | spreadBits(ux)
}

// Decodes a Morton code back into 2D coordinates
// Returns signed coordinates using (0, 0) as center
function mortonDecode(morton) {
    const ux = compactBits(morton)
    const uy = compactBits(morton >>> 1)
    const x = unsignedToSigned(ux)
    const y = unsignedToSigned(uy)
    return { x, y }
}


// TODO: break this out
const cellCount = Array(16).fill(0)
const collisionMap = []

export { mortonEncode, mortonDecode }