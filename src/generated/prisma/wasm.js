
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.AdminUserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  name: 'name',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidateScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  position: 'position',
  party: 'party',
  color: 'color',
  photoUrl: 'photoUrl',
  bio: 'bio',
  education: 'education',
  publicService: 'publicService',
  officialWebsite: 'officialWebsite',
  socialLinks: 'socialLinks',
  displayOrder: 'displayOrder',
  isPublished: 'isPublished',
  lastVerifiedAt: 'lastVerifiedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidateEducationScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  degree: 'degree',
  institution: 'institution',
  year: 'year',
  displayOrder: 'displayOrder',
  sourceUrl: 'sourceUrl',
  sourceTitle: 'sourceTitle',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidatePublicServiceScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  position: 'position',
  title: 'title',
  period: 'period',
  displayOrder: 'displayOrder',
  sourceUrl: 'sourceUrl',
  sourceTitle: 'sourceTitle',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidatePlatformScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  title: 'title',
  description: 'description',
  category: 'category',
  sourceUrl: 'sourceUrl',
  sourceTitle: 'sourceTitle',
  sourceType: 'sourceType',
  publicationDate: 'publicationDate',
  verificationStatus: 'verificationStatus',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidateSourceScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  category: 'category',
  title: 'title',
  url: 'url',
  publisher: 'publisher',
  publicationDate: 'publicationDate',
  accessedDate: 'accessedDate',
  verificationStatus: 'verificationStatus',
  notes: 'notes',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyCampaignScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  enablePresident: 'enablePresident',
  enableVicePresident: 'enableVicePresident',
  enableSenators: 'enableSenators',
  maxSenatorSelections: 'maxSenatorSelections',
  ipRestrictionEnabled: 'ipRestrictionEnabled',
  minResponseThreshold: 'minResponseThreshold',
  publicResultsVisible: 'publicResultsVisible',
  geographicResultsVisible: 'geographicResultsVisible',
  presidentialQuestion: 'presidentialQuestion',
  vicePresidentialQuestion: 'vicePresidentialQuestion',
  senatorialQuestion: 'senatorialQuestion',
  geographicQuestion: 'geographicQuestion',
  methodologyDisclaimer: 'methodologyDisclaimer',
  privacyNotice: 'privacyNotice',
  activeVotesAdjustment: 'activeVotesAdjustment',
  todayVotesAdjustment: 'todayVotesAdjustment',
  domesticVotesAdjustment: 'domesticVotesAdjustment',
  overseasVotesAdjustment: 'overseasVotesAdjustment',
  provincesReportingOverride: 'provincesReportingOverride',
  activeVotesReason: 'activeVotesReason',
  todayVotesReason: 'todayVotesReason',
  domesticVotesReason: 'domesticVotesReason',
  overseasVotesReason: 'overseasVotesReason',
  provincesReportingReason: 'provincesReportingReason',
  statsLastAdjustedAt: 'statsLastAdjustedAt',
  statsLastAdjustedBy: 'statsLastAdjustedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyAdjustmentScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  candidateId: 'candidateId',
  category: 'category',
  amount: 'amount',
  reason: 'reason',
  adminId: 'adminId',
  adminEmail: 'adminEmail',
  status: 'status',
  geographicScope: 'geographicScope',
  regionId: 'regionId',
  provinceId: 'provinceId',
  reversedByAdjustmentId: 'reversedByAdjustmentId',
  reversalReason: 'reversalReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveySubmissionScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  participantName: 'participantName',
  residenceType: 'residenceType',
  countryCode: 'countryCode',
  countryName: 'countryName',
  overseasRegion: 'overseasRegion',
  overseasCity: 'overseasCity',
  regionId: 'regionId',
  regionName: 'regionName',
  provinceId: 'provinceId',
  provinceName: 'provinceName',
  cityId: 'cityId',
  cityName: 'cityName',
  status: 'status',
  ageGroup: 'ageGroup',
  gender: 'gender',
  civilStatus: 'civilStatus',
  isFirstTimeVoter: 'isFirstTimeVoter',
  ipHash: 'ipHash',
  tokenHash: 'tokenHash',
  retractedAt: 'retractedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidateSelectionScalarFieldEnum = {
  id: 'id',
  submissionId: 'submissionId',
  candidateId: 'candidateId',
  position: 'position',
  createdAt: 'createdAt'
};

exports.Prisma.AdminAuditLogScalarFieldEnum = {
  id: 'id',
  adminEmail: 'adminEmail',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  details: 'details',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.CandidateLegislativeRecordScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  chamber: 'chamber',
  congress: 'congress',
  billNo: 'billNo',
  title: 'title',
  longTitle: 'longTitle',
  role: 'role',
  status: 'status',
  republicActNo: 'republicActNo',
  filedDate: 'filedDate',
  sourceInstitution: 'sourceInstitution',
  sourceUrl: 'sourceUrl',
  pdfUrl: 'pdfUrl',
  reviewStatus: 'reviewStatus',
  matchConfidence: 'matchConfidence',
  matchNotes: 'matchNotes',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LegislativeImportJobScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  totalFound: 'totalFound',
  insertedCount: 'insertedCount',
  updatedCount: 'updatedCount',
  skippedCount: 'skippedCount',
  needsReviewCount: 'needsReviewCount',
  error: 'error',
  sourcesChecked: 'sourcesChecked',
  coverageNotes: 'coverageNotes',
  createdAt: 'createdAt'
};

exports.Prisma.AdminLoginAttemptScalarFieldEnum = {
  id: 'id',
  ipAddress: 'ipAddress',
  attemptedIdentifier: 'attemptedIdentifier',
  userId: 'userId',
  status: 'status',
  failureReason: 'failureReason',
  userAgent: 'userAgent',
  requestId: 'requestId',
  createdAt: 'createdAt'
};

exports.Prisma.BlockedIpAddressScalarFieldEnum = {
  id: 'id',
  ipAddress: 'ipAddress',
  reason: 'reason',
  adminId: 'adminId',
  adminEmail: 'adminEmail',
  status: 'status',
  expiresAt: 'expiresAt',
  unblockedAt: 'unblockedAt',
  unblockedBy: 'unblockedBy',
  unblockReason: 'unblockReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  AdminUser: 'AdminUser',
  Candidate: 'Candidate',
  CandidateEducation: 'CandidateEducation',
  CandidatePublicService: 'CandidatePublicService',
  CandidatePlatform: 'CandidatePlatform',
  CandidateSource: 'CandidateSource',
  SurveyCampaign: 'SurveyCampaign',
  SurveyAdjustment: 'SurveyAdjustment',
  SurveySubmission: 'SurveySubmission',
  CandidateSelection: 'CandidateSelection',
  AdminAuditLog: 'AdminAuditLog',
  CandidateLegislativeRecord: 'CandidateLegislativeRecord',
  LegislativeImportJob: 'LegislativeImportJob',
  AdminLoginAttempt: 'AdminLoginAttempt',
  BlockedIpAddress: 'BlockedIpAddress'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
