# Feature flags

## Overview

Feature flags are a way to enable/disable features in the application. This is useful for testing new features, or for hiding features that are not ready for production. Its also helpful for enabling continuous deployment, where we can deploy to production without worrying about breaking the site. We can be working incrementally on new features, and avoid piling up merge conflicts which is what can happen with long-lived branches.

## How it works

Create a constant in `src/constants/feature-flags` named `FEAT_<feature-name>`. This should look for an environment variable name `NEXT_PUBLIC_FEAT_<feature-name>`. If the environment variable is set to `'true'`, then the feature is enabled. If the environment variable is not set, or is set to `false`, then the feature is disabled.

## Preview deploys

Add the environment variable to all, or certain previews in the vercel dashboard. For example, if you want to enable the feature on the testing site, but not on staging, then add the environment variable to the testing deploy.

## Local development

Add the environment variable to your `.env.local` file. For example `NEXT_PUBLIC_FEAT_MY_FEATURE=true`. You can also use a string: `NEXT_PUBLIC_FEAT_MY_FEATURE='true'`. Dotenv will read `true` as a string anyways.
