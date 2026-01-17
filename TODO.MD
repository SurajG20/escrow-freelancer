# Escrow Platform - Development Plan

## Overview

This document outlines the implementation plan for enhancing the escrow platform with improved milestone management, project approval workflows, UI/UX improvements, and automated fund releases.

---

## Phase 1: Milestone Enhancement & UI Improvements

### Task 1: Create Milestone Enhancement - Title and Description with Proper Markdown

**Priority:** High  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Add markdown support for milestone titles and descriptions
- Create rich text editor component for milestone creation/editing
- Store markdown content in database
- Render markdown in milestone display components

**Implementation Steps:**

1. Install markdown library (e.g., `react-markdown`, `marked`)
2. Create `MilestoneEditor` component with markdown preview
3. Update milestone creation form in `/dashboard/projects/new/page.tsx`
4. Update milestone submission form in `/dashboard/projects/[id]/page.tsx`
5. Update database schema if needed (description field already exists)
6. Add markdown rendering in milestone display components

**Files to Modify:**

- `src/app/dashboard/projects/new/page.tsx`
- `src/app/dashboard/projects/[id]/page.tsx`
- `src/components/milestones/MilestoneEditor.tsx` (new)
- `src/components/milestones/MilestoneDisplay.tsx` (new)

---

### Task 2: Show All Details While Deploying

**Priority:** High  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Display comprehensive deployment information during contract deployment
- Show contract address, transaction hash, gas estimates
- Display milestone breakdown and total amounts
- Show deployment progress with clear status messages

**Implementation Steps:**

1. Create deployment modal/overlay component
2. Add deployment details display (contract address, milestones, amounts)
3. Show transaction status and progress
4. Display gas estimates before deployment
5. Show success confirmation with contract details

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- `src/components/deployment/DeploymentModal.tsx` (new)
- `src/lib/contracts/deploy.ts`

---

### Task 9: Fix Button Loading States - Individual Button Loaders

**Priority:** High  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Only the clicked button should show loading state
- Other buttons should be disabled (not loading)
- Prevent multiple simultaneous submissions
- Clear visual feedback for user actions

**Implementation Steps:**

1. Replace global `txPending` state with per-action loading states
2. Add individual loading states for each button (submit, approve, reject, etc.)
3. Disable other buttons when one action is in progress
4. Update all action handlers to use individual loading states

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- All components with action buttons

---

### Task 10: Add Image Upload and Text Options for Milestone Submission

**Priority:** Medium  
**Status:** Pending  
**Dependencies:** Task 1

**Requirements:**

- Allow freelancers to upload images when submitting milestones
- Support text descriptions alongside images
- Store attachments in database (JSONB field)
- Display images in milestone submission view

**Implementation Steps:**

1. Add file upload component for images
2. Update milestone submission form to include image upload
3. Store image URLs/metadata in milestone attachments field
4. Add image display in milestone submission view
5. Integrate with storage service (Supabase Storage or similar)

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- `src/lib/api/milestones.ts`
- `src/components/milestones/MilestoneSubmissionForm.tsx` (new)
- Database: Add attachments field to milestones table if not exists

---

## Phase 2: Project Approval & Workflow

### Task 3: Auto-Matching Projects - Freelancer Wallet Address Matching

**Priority:** High  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- When a project is created with a freelancer wallet address, automatically show it to that freelancer when they login
- Projects should be visible to both client and freelancer based on wallet addresses
- Ensure proper filtering in project list queries

**Implementation Steps:**

1. Verify `listProjects` API correctly filters by `wallet_address` (already implemented)
2. Ensure `useProjects` hook uses wallet address filter correctly
3. Test that projects appear for both client and freelancer
4. Add automatic project matching on login/wallet connection
5. Update project creation to ensure freelancer_wallet is set correctly

**Files to Modify:**

- `src/lib/api/projects.ts` (verify implementation)
- `src/lib/hooks/useProjects.ts` (verify implementation)
- `src/app/dashboard/projects/page.tsx` (verify filtering)
- `src/app/dashboard/projects/new/page.tsx` (ensure freelancer_wallet is set)

---

### Task 6: Prevent Milestone Submission Until Project Approved and Funds Deposited

**Priority:** High  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Disable milestone submission button if project status is not "active"
- Check that project has been approved (`status === "approved"`)
- Verify that funds have been deposited (`onchain_address` exists and is valid)
- Show clear error messages explaining why submission is disabled

**Implementation Steps:**

1. Add validation in milestone submission handler
2. Disable submit button based on project status and fund deposit status
3. Add tooltip/error message explaining requirements
4. Update UI to show disabled state clearly

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- `src/lib/api/milestones.ts` (add server-side validation)

---

### Task 7: Send Rejection Reason and Showcase to Client

**Priority:** Medium  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Add `rejection_reason` field to projects/milestones table
- Allow freelancer to provide reason when rejecting milestone
- Display rejection reason to client in project view
- Show rejection reason in milestone history/timeline

**Implementation Steps:**

1. Add `rejection_reason` field to database schema
2. Update `rejectProject` and milestone rejection APIs to accept reason
3. Create rejection modal/form component
4. Display rejection reason in project detail page
5. Update types and validation schemas

**Files to Modify:**

- `supabase/init.sql` (add rejection_reason field)
- `src/lib/api/projects.ts`
- `src/lib/api/milestones.ts`
- `src/app/dashboard/projects/[id]/page.tsx`
- `src/types/index.ts`
- `src/lib/validation/schemas.ts`

---

### Task 8: Update Changes and Send Again for Approval

**Priority:** Medium  
**Status:** Pending  
**Dependencies:** Task 7

**Requirements:**

- After rejection, allow client to edit project/milestones
- Provide "Update and Resubmit" functionality
- Reset project status to "draft" after edits
- Allow sending for approval again after updates

**Implementation Steps:**

1. Enhance edit mode to work with rejected projects
2. Add "Update and Resubmit" button after rejection
3. Reset status to "draft" when updating rejected project
4. Clear rejection reason when resubmitting
5. Update workflow to allow re-approval cycle

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- `src/lib/api/projects.ts`

---

### Task 11: Add Reject Option During Approval with Reason

**Priority:** Medium  
**Status:** Pending  
**Dependencies:** Task 7

**Requirements:**

- Allow client to reject milestone submissions (not just approve)
- Provide rejection reason input field
- Store rejection reason with milestone
- Show rejection reason to freelancer
- Allow freelancer to update and resubmit after rejection

**Implementation Steps:**

1. Add "Reject" button alongside "Approve" button for milestones
2. Create rejection modal with reason input
3. Update milestone rejection API to store reason
4. Display rejection reason in milestone view
5. Update milestone state to "awaiting_submission" after rejection

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- `src/lib/api/milestones.ts`
- `src/components/milestones/MilestoneRejectionModal.tsx` (new)

---

## Phase 3: Dashboard & Display Fixes

### Task 4: Check Dashboard Data - Automated and Dynamically Updated

**Priority:** Medium  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Verify dashboard stats are automatically updated
- Ensure real-time updates when projects change
- Add auto-refresh mechanism
- Verify query invalidation works correctly

**Implementation Steps:**

1. Review `useProjects` hook for proper cache invalidation
2. Add real-time subscriptions (Supabase Realtime) if needed
3. Verify dashboard stats calculation is correct
4. Test that stats update when projects change
5. Add polling or websocket connection for live updates

**Files to Modify:**

- `src/app/dashboard/page.tsx`
- `src/lib/hooks/useProjects.ts`
- Consider adding Supabase Realtime subscriptions

---

### Task 5: Fix Projects Not Showing in Board Mode

**Priority:** High  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Fix board view to properly display projects
- Ensure projects are filtered and displayed correctly
- Fix status-based column grouping
- Handle empty states properly

**Implementation Steps:**

1. Review board view implementation in `src/app/dashboard/projects/page.tsx`
2. Fix project filtering logic for board view
3. Ensure projects are grouped by status correctly
4. Test with different project statuses
5. Fix any rendering issues with project cards

**Files to Modify:**

- `src/app/dashboard/projects/page.tsx` (lines 150-204)

---

## Phase 4: Dispute & Fund Release

### Task 12: Ensure Dispute System Works Correctly

**Priority:** Medium  
**Status:** Pending  
**Dependencies:** None

**Requirements:**

- Verify dispute creation flow works
- Test dispute resolution process
- Ensure disputes are properly linked to milestones/projects
- Verify dispute status updates correctly

**Implementation Steps:**

1. Review dispute creation in project detail page
2. Test dispute flow end-to-end
3. Verify dispute API endpoints work correctly
4. Check dispute display in disputes page
5. Test dispute resolution workflow

**Files to Modify:**

- `src/app/dashboard/disputes/page.tsx`
- `src/lib/api/disputes.ts`
- `src/lib/hooks/useDisputes.ts`
- `src/app/dashboard/projects/[id]/page.tsx`

---

### Task 13: Automatic Fund Release to Freelancer Wallet on Approval

**Priority:** High  
**Status:** Pending  
**Dependencies:** Task 6

**Requirements:**

- When client approves milestone, automatically release funds to freelancer
- Call smart contract `releaseMilestone` function on approval
- Update milestone state to "released" after successful transaction
- Handle transaction errors gracefully
- Show transaction status to user

**Implementation Steps:**

1. Update milestone approval handler to call contract release function
2. Integrate `releaseMilestoneFunds` from `src/lib/contracts/escrow.ts`
3. Update milestone state after successful release
4. Add transaction confirmation and error handling
5. Show loading states during fund release

**Files to Modify:**

- `src/app/dashboard/projects/[id]/page.tsx`
- `src/lib/contracts/escrow.ts` (verify releaseMilestoneFunds implementation)
- `src/lib/api/milestones.ts`

---

## Implementation Priority Order

1. **Task 5** - Fix board view (blocking UI issue)
2. **Task 6** - Prevent submission until approved/deposited (critical workflow)
3. **Task 9** - Fix button loading states (UX improvement)
4. **Task 3** - Auto-matching projects (core functionality)
5. **Task 13** - Automatic fund release (core functionality)
6. **Task 2** - Show deployment details (UX improvement)
7. **Task 1** - Milestone markdown support (enhancement)
8. **Task 7** - Rejection reasons (workflow improvement)
9. **Task 11** - Reject during approval (workflow improvement)
10. **Task 8** - Update and resubmit (workflow improvement)
11. **Task 10** - Image upload (enhancement)
12. **Task 4** - Dashboard auto-update (optimization)
13. **Task 12** - Dispute verification (testing/verification)

---

## Notes

- All database schema changes should be added to migration files
- API changes should maintain backward compatibility where possible
- All UI changes should follow existing design patterns
- Test each feature thoroughly before moving to next phase
- Consider adding unit tests for critical workflows
