/**
 * Shared JSDoc typedefs and lightweight validators.
 * Kept JS-only (no TS) while retaining IDE intellisense.
 */

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} name
 * @property {string} logoUrl
 * @property {string} location
 * @property {string=} website
 */

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} companyId
 * @property {string} companyName
 * @property {string} companyLogoUrl
 * @property {string} location
 * @property {string} salaryText
 * @property {string[]} badges
 * @property {string} experienceText
 * @property {string=} notes
 * @property {string=} descriptionHtml
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} location
 * @property {string=} avatarUrl
 * @property {string[]=} skills
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} data
 * @property {string=} message
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {boolean} success
 * @property {string} message
 * @property {string=} code
 * @property {any=} details
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken
 * @property {string=} refreshToken
 */

/**
 * @typedef {Object} SignedInUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string[]=} roles
 */

export {}
