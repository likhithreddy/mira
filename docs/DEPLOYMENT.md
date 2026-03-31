# Deployment

## Environments

| Environment | URL                                                | Trigger              |
| ----------- | -------------------------------------------------- | -------------------- |
| Production  | [miraprep.vercel.app](https://miraprep.vercel.app) | Push/merge to `main` |
| Preview     | Auto-generated per PR                              | Pull request opened  |

Production deploys from `main`. Preview deployments are created automatically for every pull request by the Vercel GitHub integration, which posts the preview URL as a PR comment.

## Environment Variables

All environment variables are configured in **Vercel → Project → Settings → Environment Variables** with both Production and Preview scopes.

| Variable                        | Server-only | Notes                                  |
| ------------------------------- | ----------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | No          | Supabase project URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No          | Supabase public/anon key               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes         | No `NEXT_PUBLIC_` prefix — server-only |

## Rollback Procedure

1. Go to **Vercel Dashboard → MIRA Project → Deployments**
2. Find the previous production deployment you want to restore
3. Click the three-dot menu → **Promote to Production**
4. Wait for the promotion to complete (typically under 60 seconds)
5. Verify the production URL serves the expected version
6. To re-promote the latest deployment, repeat steps 2-4 with the newer deployment
