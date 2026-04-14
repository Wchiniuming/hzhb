-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "roleId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("roleId", "permissionId"),
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contactInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LoginLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "loginTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "age" INTEGER,
    "contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SkillTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "DeveloperSkill" (
    "developerId" TEXT NOT NULL,
    "skillTagId" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL DEFAULT 'INTERMEDIATE',

    PRIMARY KEY ("developerId", "skillTagId"),
    CONSTRAINT "DeveloperSkill_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeveloperSkill_skillTagId_fkey" FOREIGN KEY ("skillTagId") REFERENCES "SkillTag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeveloperExperience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "developerId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "role" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "description" TEXT,
    CONSTRAINT "DeveloperExperience_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "developerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT,
    "issueDate" DATETIME NOT NULL,
    "expireDate" DATETIME,
    "attachmentId" TEXT,
    CONSTRAINT "Certificate_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeveloperApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "developerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DeveloperApproval_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "deliveryStandard" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "budget" REAL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "partnerId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "taskId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "role" TEXT,
    "responsibilities" TEXT,
    "deliveryNode" DATETIME,

    PRIMARY KEY ("taskId", "developerId"),
    CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" TEXT,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskDelayRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "newEndDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "approverId" TEXT,
    "approvalTime" DATETIME,
    "comments" TEXT,
    CONSTRAINT "TaskDelayRequest_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskDeliverable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "description" TEXT,
    "attachmentIds" TEXT,
    "submissionTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskDeliverable_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskAcceptance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "deliverableId" TEXT NOT NULL,
    "acceptorId" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "acceptanceTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskAcceptance_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "comments" TEXT,
    CONSTRAINT "TaskApproval_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentIndicator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "weight" REAL NOT NULL,
    "scoringCriteria" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "AssessmentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "targetPartners" TEXT,
    "cycle" TEXT NOT NULL,
    "assessors" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "overallScore" REAL,
    "assessmentReportId" TEXT,
    CONSTRAINT "Assessment_assessmentReportId_fkey" FOREIGN KEY ("assessmentReportId") REFERENCES "AssessmentReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "autoScore" REAL,
    "manualScore" REAL,
    "finalScore" REAL,
    "comments" TEXT,
    CONSTRAINT "AssessmentScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "content" TEXT,
    "filePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "approvalDate" DATETIME,
    "publishedDate" DATETIME
);

-- CreateTable
CREATE TABLE "AssessmentApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "comments" TEXT
);

-- CreateTable
CREATE TABLE "ImprovementRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originType" TEXT NOT NULL,
    "originEntityId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" DATETIME NOT NULL,
    "responsibleType" TEXT NOT NULL,
    "responsibleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IDENTIFIED',
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "improvementPlanId" TEXT,
    CONSTRAINT "ImprovementRequirement_improvementPlanId_fkey" FOREIGN KEY ("improvementPlanId") REFERENCES "ImprovementPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImprovementPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requirementId" TEXT NOT NULL,
    "steps" TEXT,
    "timeline" TEXT,
    "responsibilities" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "approvedBy" TEXT,
    "approvalDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "improvementAcceptanceId" TEXT,
    CONSTRAINT "ImprovementPlan_improvementAcceptanceId_fkey" FOREIGN KEY ("improvementAcceptanceId") REFERENCES "ImprovementAcceptance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImprovementProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,
    "details" TEXT,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "improvementPlanId" TEXT,
    CONSTRAINT "ImprovementProgress_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ImprovementPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImprovementAcceptance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "acceptorId" TEXT NOT NULL,
    "acceptanceTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ImprovementApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "comments" TEXT,
    "improvementPlanId" TEXT,
    CONSTRAINT "ImprovementApproval_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ImprovementPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "typeId" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'MEDIUM',
    "impact" TEXT,
    "triggerConditions" TEXT,
    "dispositionMeasures" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalFilename" TEXT NOT NULL,
    "storedFilename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "entityType" TEXT,
    "entityId" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tableName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "fieldName" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "operation" TEXT NOT NULL,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "ipAddress" TEXT,
    "metadata" TEXT
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "operationTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" TEXT,
    "ipAddress" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_name_key" ON "Partner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SkillTag_name_key" ON "SkillTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentReport_assessmentId_key" ON "AssessmentReport"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ImprovementPlan_requirementId_key" ON "ImprovementPlan"("requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "ImprovementAcceptance_planId_key" ON "ImprovementAcceptance"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskType_name_key" ON "RiskType"("name");
