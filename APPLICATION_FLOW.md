# Escrow Application Flow Documentation

## Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [Dashboard Overview](#dashboard-overview)
3. [Project Creation Flow](#project-creation-flow)
4. [Project Detail & Milestone Workflow](#project-detail--milestone-workflow)
5. [Dispute Resolution Flow](#dispute-resolution-flow)
6. [Vaults & Transactions](#vaults--transactions)
7. [Profile & Settings](#profile--settings)
8. [Data Flow Architecture](#data-flow-architecture)
9. [Security & Permissions](#security--permissions)

---

## Authentication Flow

### Step-by-Step Process

```
User visits app → Login Page (/login)
    ↓
Connect Wallet (via Reown AppKit - supports MetaMask, WalletConnect, etc.)
    ↓
Wallet Connected → Shows wallet address and network
    ↓
User clicks "Sign In" → Signs message with wallet
    ↓
Backend verifies signature → Creates/updates user in Supabase
    ↓
Session stored in localStorage → Redirects to /dashboard
    ↓
AuthGuard protects dashboard routes → Checks session on each page
```

### Key Components

- **`useAuth()` hook**: Manages authentication state
- **`AuthGuard` component**: Protects dashboard routes
- **Session storage**: Stored in localStorage with wallet address
- **Auto user creation**: User profile created in Supabase on first sign-in

### Authentication Files

- `src/lib/auth/web3.ts` - Web3 authentication logic
- `src/lib/hooks/useAuth.ts` - Authentication hook
- `src/components/auth/AuthGuard.tsx` - Route protection
- `src/app/login/page.tsx` - Login page

---

## Dashboard Overview

### Flow

```
User lands on /dashboard
    ↓
useAuth() fetches current user from Supabase
    ↓
useProjects() fetches user's projects (filtered by wallet address)
    ↓
Calculates stats:
  - Total locked funds
  - Active projects count
  - Pending actions
  - Reputation score
    ↓
Displays real-time data from Supabase
```

### Features

- Real-time project statistics
- Active projects overview
- Pending actions indicator
- Reputation score display

---

## Project Creation Flow

### Multi-Step Process

#### Step 1: Basic Information
- Enter project title
- Enter description
- Enter counterparty wallet address
- Select role (Client or Freelancer)
- Network selection (auto-detected from connected wallet)

#### Step 2: Milestones
- Add milestone(s) with:
  - Title/description
  - Amount (NATIVE or USDT)
  - Deadline
- Can add/remove multiple milestones
- Dynamic currency selection based on network

#### Step 3: Review
- Shows project summary
- Calculates total amount
- Shows network fees
- Final confirmation

### Database Operations

```
User clicks "Create Project"
    ↓
createProject() → Inserts into Supabase projects table
  - onchain_address: Generated placeholder
  - client_wallet: User's wallet (if client) or counterparty
  - freelancer_wallet: User's wallet (if freelancer) or counterparty
  - chain_id: Current network chain ID
  - status: "draft"
    ↓
createMilestones() → Inserts milestones into Supabase milestones table
  - project_id: Foreign key to project
  - index: Sequential order
  - offchain_state: "awaiting_submission"
  - currency: NATIVE or USDT
    ↓
Redirects to /dashboard/projects/[id]
```

### Files

- `src/app/dashboard/projects/new/page.tsx` - Project creation form
- `src/lib/api/projects.ts` - Project API functions
- `src/lib/api/milestones.ts` - Milestone API functions

---

## Deposit Funds & Smart Contract Deployment Flow

### Overview

When a project is created, it starts with `status: "draft"` and a placeholder `onchain_address`. The project becomes active only after funds are deposited into a deployed smart contract.

### Recommended Approach: Factory Contract Pattern

**Option 1: Factory Contract (Recommended)**
- Deploy a single factory contract that creates escrow contracts per project
- More gas efficient (factory contract deployed once)
- Easier to upgrade/maintain
- Each project gets its own escrow contract instance

**Option 2: Individual Contracts**
- Deploy a new escrow contract for each project
- More gas cost per project
- More flexibility per contract

**Option 3: Shared Escrow Contract**
- Single escrow contract managing multiple projects
- Most gas efficient
- More complex state management
- Potential for contract size limits

### Deposit Funds Flow

```
Project created (status: "draft", onchain_address: placeholder)
    ↓
User clicks "Deposit Funds" on project detail page
    ↓
1. Deploy Escrow Smart Contract (or create via factory)
   - Contract parameters:
     * client_wallet: Project client address
     * freelancer_wallet: Project freelancer address
     * milestones: Array of milestone amounts and currencies
     * chain_id: Network chain ID
    ↓
2. Contract deployed → Get contract address
    ↓
3. Update project in database:
   - onchain_address: Deployed contract address
   - status: "draft" → "active"
    ↓
4. Deposit funds into contract:
   - If NATIVE: Send native tokens (BNB, ETH, SOL)
   - If USDT: Approve and transfer USDT tokens
   - Total amount = sum of all milestone amounts
    ↓
5. Verify deposit on-chain
    ↓
6. Project status: "active"
   - Milestones can now be managed
   - Funds are locked in escrow
```

### Smart Contract Requirements

The escrow contract should support:

1. **Deposit**: Accept funds (NATIVE or USDT) from client
2. **Release**: Release funds to freelancer when milestone is approved
3. **Refund**: Allow client to cancel and refund (if project cancelled)
4. **Dispute**: Lock funds during dispute resolution
5. **Multi-currency**: Handle both native tokens and USDT
6. **Milestone-based**: Track individual milestone releases

### Implementation Status

- ✅ Frontend deposit button and UI
- ✅ Database schema supports onchain_address and status
- ⏳ Smart contract deployment logic (to be implemented)
- ⏳ On-chain deposit functionality (to be implemented)
- ⏳ Contract verification and status updates (to be implemented)

### Files

- `src/app/dashboard/projects/[id]/page.tsx` - Deposit funds button
- `src/lib/api/projects.ts` - Update project with contract address
- `src/lib/contracts/` - Smart contract utilities (to be created)
  - `deploy.ts` - Contract deployment logic
  - `escrow.ts` - Escrow contract interaction
  - `types.ts` - Contract type definitions

---

## Project Detail & Milestone Workflow

### Milestone State Machine

```
┌─────────────────────────────────────────┐
│ awaiting_submission (Initial)          │
│ ↓ (Freelancer submits work)             │
│ submitted                               │
│ ↓ (Client approves)                     │
│ approved                                │
│ ↓ (Funds released)                      │
│ released                                │
│                                         │
│ OR (Dispute raised at any stage)       │
│ disputed                                │
└─────────────────────────────────────────┘
```

### Available Actions

#### For Freelancers:
- **Submit Work**: When milestone is `awaiting_submission`
  - Updates `offchain_state` to `"submitted"`
  - Triggers notification to client

#### For Clients:
- **Approve & Pay**: When milestone is `submitted`
  - Updates `offchain_state` to `"approved"`
  - Funds can be released on-chain

#### For Both Parties:
- **Raise Dispute**: At any milestone stage
  - Creates dispute record
  - Changes milestone state to `"disputed"`

### Project Detail Page Features

- Real-time milestone status
- Contract state visualizer
- Total contract value calculation
- Released funds tracking
- Dispute creation
- Activity feed (placeholder)

### Files

- `src/app/dashboard/projects/[id]/page.tsx` - Project detail page
- `src/lib/hooks/useMilestones.ts` - Milestone hooks
- `src/lib/hooks/useProjects.ts` - Project hooks

---

## Dispute Resolution Flow

### Dispute Creation

```
User raises dispute → Creates dispute in Supabase
    ↓
Dispute created with:
  - project_id: Links to project
  - milestone_id: Optional, links to specific milestone
  - opened_by: Wallet address of dispute initiator
  - status: "open"
  - resolution: null (initially)
    ↓
Dispute appears in /dashboard/disputes
```

### Dispute Status Progression

```
open → voting → resolved
```

### Resolution Structure

Resolution stored in JSONB field:
```json
{
  "decision": "string",
  "split_percent": number,
  "votes": {
    "arbitrator1": "client",
    "arbitrator2": "freelancer"
  }
}
```

### Dispute Page Features

- List all disputes for user's projects
- Filter by status (open, voting, resolved)
- View dispute details
- See associated project information
- Resolution outcomes

### Files

- `src/app/dashboard/disputes/page.tsx` - Disputes listing
- `src/lib/api/disputes.ts` - Dispute API functions
- `src/lib/hooks/useDisputes.ts` - Dispute hooks

---

## Vaults & Transactions

### Flow

```
User visits /dashboard/vaults
    ↓
Fetches all active projects (status: "active" or "in_dispute")
    ↓
Calculates:
  - Total Value Locked (sum of all milestone amounts)
  - Pending Release (milestones awaiting approval)
  - Available to Withdraw (released funds)
    ↓
Shows recent projects with locked funds
```

### Vault Statistics

- **Total Value Locked**: Sum of all milestone amounts in active projects
- **Pending Release**: Milestones in `submitted` or `approved` state
- **Available to Withdraw**: Milestones in `released` state

### Files

- `src/app/dashboard/vaults/page.tsx` - Vaults page

---

## Profile & Settings

### Profile Page Flow

```
User visits /dashboard/profile
    ↓
Fetches user data from Supabase:
  - display_name
  - bio
  - avatar_url
  - roles (client, freelancer, arbitrator)
    ↓
Calculates stats from projects:
  - Jobs completed (projects with status "completed")
  - Total volume (sum of all project values)
  - Dispute rate (disputes / total projects)
  - Reputation score (calculated from reputation_events)
    ↓
Shows recent projects
Displays roles and badges
```

### Settings Page Flow

```
User visits /dashboard/settings
    ↓
Loads current user profile data
    ↓
User edits:
  - Display name
  - Bio
  - Avatar URL
    ↓
Clicks "Save Changes"
    ↓
useUpdateUser() → Updates Supabase users table
    ↓
Success message → Refreshes data
```

### Profile Features

- User information display
- Statistics calculation
- Recent projects list
- Roles and badges
- Editable profile information

### Files

- `src/app/dashboard/profile/page.tsx` - Profile page
- `src/app/dashboard/settings/page.tsx` - Settings page
- `src/lib/api/users.ts` - User API functions
- `src/lib/hooks/useUser.ts` - User hooks

---

## Data Flow Architecture

### Complete Stack

```
Frontend (Next.js/React)
    ↓
React Query Hooks (useProjects, useAuth, etc.)
    ↓
API Layer (lib/api/*.ts)
    ↓
Supabase Client (lib/supabase/client.ts)
    ↓
Supabase Database (PostgreSQL)
    ↓
Tables:
  - users
  - projects
  - milestones
  - disputes
  - messages
  - reputation_events
```

### Data Flow Example: Fetching Projects

```
Component (ProjectsPage)
    ↓
useProjects({ client_wallet: address })
    ↓
React Query manages cache and state
    ↓
listProjects(filters) in lib/api/projects.ts
    ↓
supabase.from("projects").select("*").eq("client_wallet", address)
    ↓
Supabase executes query with RLS policies
    ↓
Returns data → Validated with Zod schemas
    ↓
React Query updates cache
    ↓
Component re-renders with fresh data
```

### Real-Time Updates

- **React Query** handles caching and refetching
- **staleTime**: 1-5 minutes depending on data type
- **refetchOnWindowFocus**: Enabled for fresh data
- **Mutations invalidate queries**: Triggers automatic refetch

---

## Security & Permissions

### Authentication Security

- **Web3 Signature Verification**: All sign-ins require wallet signature
- **Nonce-based Authentication**: Prevents replay attacks
- **Session Management**: Stored in localStorage with expiration
- **Auto-expiration**: Sessions expire after 1 hour

### Database Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Allow read/write based on wallet address
- **Web3 Auth**: No traditional passwords, wallet-based only

### Access Control

- **Wallet Address**: Primary identifier for users
- **Client-side Filtering**: Projects filtered by wallet address
- **Role-based Actions**: Different actions for clients vs freelancers

### RLS Policies

```sql
-- Users can read projects they're involved in
CREATE POLICY "Users can read projects they're involved in" ON projects
    FOR SELECT USING (true);

-- Application layer filters by wallet address
-- Projects filtered by client_wallet or freelancer_wallet
```

---

## Key Features Summary

1. **Web3-First Authentication**: No passwords, wallet-based only
2. **Automatic User Profile Creation**: On first sign-in
3. **Real-Time Data**: All data from Supabase with React Query
4. **Milestone-Based Escrow**: Secure milestone workflow
5. **Dispute Resolution System**: Decentralized arbitration
6. **Multi-Chain Support**: BSC, Solana, and more
7. **Role-Based Actions**: Client vs Freelancer permissions

---

## File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                    # Dashboard overview
│   │   ├── projects/
│   │   │   ├── page.tsx               # Projects listing
│   │   │   ├── new/page.tsx           # Project creation
│   │   │   └── [id]/page.tsx          # Project detail
│   │   ├── disputes/page.tsx          # Disputes listing
│   │   ├── vaults/page.tsx            # Vaults & transactions
│   │   ├── profile/page.tsx           # User profile
│   │   └── settings/page.tsx          # Settings
│   └── login/page.tsx                  # Login page
├── lib/
│   ├── api/
│   │   ├── projects.ts                # Project API
│   │   ├── milestones.ts             # Milestone API
│   │   ├── disputes.ts               # Dispute API
│   │   ├── users.ts                  # User API
│   │   └── messages.ts              # Messages API
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth hook
│   │   ├── useProjects.ts            # Projects hook
│   │   ├── useMilestones.ts           # Milestones hook
│   │   ├── useDisputes.ts            # Disputes hook
│   │   └── useUser.ts                # User hook
│   ├── auth/
│   │   └── web3.ts                   # Web3 authentication
│   └── supabase/
│       └── client.ts                 # Supabase client
└── components/
    └── auth/
        └── AuthGuard.tsx             # Route protection
```

---

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `wallet_address` (TEXT, Unique)
- `display_name` (TEXT)
- `bio` (TEXT)
- `avatar_url` (TEXT)
- `roles` (TEXT[])

### Projects Table
- `id` (UUID, Primary Key)
- `onchain_address` (TEXT)
- `client_wallet` (TEXT)
- `freelancer_wallet` (TEXT)
- `chain_id` (INTEGER)
- `title` (TEXT)
- `description` (TEXT)
- `status` (TEXT: draft, active, in_dispute, completed, cancelled)

### Milestones Table
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key)
- `index` (INTEGER)
- `title` (TEXT)
- `description` (TEXT)
- `amount` (TEXT)
- `currency` (TEXT: NATIVE, USDT)
- `chain_id` (INTEGER)
- `deadline` (TIMESTAMP)
- `offchain_state` (TEXT: awaiting_submission, submitted, approved, disputed, released)

### Disputes Table
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key)
- `milestone_id` (UUID, Foreign Key, Optional)
- `opened_by` (TEXT)
- `status` (TEXT: open, voting, resolved)
- `resolution` (JSONB)

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Getting Started

1. **Setup Supabase**:
   - Create a Supabase project
   - Run the schema SQL files in `supabase/` directory
   - Configure RLS policies

2. **Configure Environment**:
   - Add Supabase credentials to `.env.local`

3. **Connect Wallet**:
   - Visit `/login`
   - Connect your Web3 wallet
   - Sign in with message signature

4. **Create Project**:
   - Navigate to Projects → New Project
   - Fill in project details
   - Add milestones
   - Create project

5. **Manage Projects**:
   - View projects in dashboard
   - Manage milestones
   - Handle disputes
   - Track vaults

---

## Notes

- All authentication is wallet-based (no passwords)
- User profiles are auto-created on first sign-in
- Projects are filtered by wallet address
- Milestones follow a state machine workflow
- Disputes can be raised at any milestone stage
- All data is stored in Supabase PostgreSQL database
- React Query handles caching and real-time updates

