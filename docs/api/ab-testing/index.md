---
sidebar_position: 1
sidebar_label: "Overview"
---

# AB Testing - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The AB Testing feature enables statistical experimentation and variant testing within Countly applications. It allows administrators to create controlled experiments with multiple variants, track user participation, measure performance metrics, and determine statistical winners based on Bayesian statistical analysis. Experiments target specific user segments, track conversion goals across variants, and provide real-time performance monitoring with completion indicators.

## Database Collections

| Collection | Purpose |
|---|---|
| `countly_out.ab_testing_experiments{appId}` | Stores experiment definitions, variants, goals, status, and results data for statistical analysis |
| `countly.app_users{appId}` | User profiles with `ab` field containing array of `{experiment_id, variant_index}` assignments |
| `countly.cohorts` | Auto-created cohorts for tracking conversion goals per variant (created at experiment start) |

## Configuration & Settings

The ab-testing feature does not expose user-configurable settings through config.sample.js. Configuration is managed entirely through experiment creation and API operations:

- **Experiment Status Lifecycle**: drafts → running → completed
- **Maximum Experiments**: 100 per app (enforced via count check on creation)
- **Variant Assignment**: Deterministic via device ID hash with target user filtering
- **Statistical Engine**: Bayesian models (Stan-based) for continuous performance calculation

## API Endpoints

### Experiment Discovery & Management

- [List All Experiments](read.md) - `/o?method=ab-testing`
- [Get Specific Experiments](experiment-read.md) - `/o/ab-testing/experiment`
- [Get Experiment Details](experiment-detail.md) - `/o/ab-testing/experiment-detail`
- [Check Bayesian Models](check-models.md) - `/o/ab-testing/check-models`

### Experiment Creation & Updates

- [Create Experiment](add.md) - `/i/ab-testing/add-experiment`
- [Update Experiment](update.md) - `/i/ab-testing/update-experiment`

### Experiment Lifecycle Control

- [Start Experiment](start.md) - `/i/ab-testing/start-experiment`
- [Stop Experiment](stop.md) - `/i/ab-testing/stop-experiment`
- [Reset Experiment](reset.md) - `/i/ab-testing/reset-experiment`
- [Remove Experiment](remove.md) - `/i/ab-testing/remove-experiment`

### User Experiment Assignment

- [Enroll User in Variant](enroll-variant.md) - `/i/sdk?method=ab_enroll_variant`
- [Opt Out from Experiments](opt-out.md) - `/i/sdk?method=ab_opt_out`

### SDK Variant Fetching

- [Fetch Available Variants](fetch-variants.md) - `/o/sdk?method=ab_fetch_variants`
- [Fetch Active Experiments](fetch-experiments.md) - `/o/sdk?method=ab_fetch_experiments`

## Experiment Lifecycle & Workflow

### 1. Draft Status
- Initial creation state
- Parameters can be modified
- Variants and goals are defined
- No cohorts created yet
- No users assigned
- **Allowed Actions**: Edit, Start, Delete

### 2. Running Status
- Experiment is live
- Users are assigned to variants based on targeting rules
- Real-time performance calculation
- Conversions tracked via auto-created cohorts
- Performance metrics continuously updated
- **Allowed Actions**: Stop, Reset, View Results
- **Cannot Modify**: Variants, parameters, or goals after starting

### 3. Completed Status
- Experiment manually stopped or auto-stopped when improvement target conditions are met
- Final results calculated and winner determined
- User assignments frozen
- No new variant assignments occur
- Results persist indefinitely
- **Allowed Actions**: View Results, Reset, Delete

## Key Concepts

### Variant Assignment Mechanism

**Deterministic Device-ID Based Assignment:**
- Uses hash of device_id and experiment_id to determine variant
- Same `device_id` always receives the same variant for the same experiment
- Ensures consistency across sessions for that device identifier

**Targeting & Filtering:**
1. **Percentage Filter**: Random selection via device_id hash against target percentage
2. **Drill Conditions**: Optional JSON Drill filter for advanced segmentation
   - Example: `{"up.d": {"$in": ["iPhone8,1"]}}` targets specific device models
   - Example: `{"custom.subscription": {"$eq": "premium"}}` targets premium users

**Assignment Priority:**
- Users already in experiment maintain variant across sessions
- New users assigned based on percentage and conditions
- Manual enrollment overrides percentage assignment

### Conversion Goal Tracking

**Automatic Cohort Creation:**
- On experiment start, creates cohorts for each (variant, goal) combination
- Cohort naming: `[CLY]_AB_E:{experiment_id}_V:{variant_index}_G:{goal_index}`
- Tracks user events matching goal criteria per variant

**Goal Definition Components:**
- **Steps**: Event sequences to track (e.g., click → purchase)
- **User Segmentation**: Additional filtering applied to goal conversions

### Statistical Analysis

**Bayesian Framework:**
- Uses Bayesian statistical models (.stan files) for continuous analysis
- No p-value thresholds; continuous posterior probability calculation
- "Probability beat baseline" indicates probability variant outperforms control

**Performance Metrics:**
- **Improvement**: Percentage improvement of variant vs. baseline
- **Conversion Rate**: Conversion users / total users per variant
- **Probability Beat Baseline**: Bayesian posterior probability of variant superiority
- **Conversion Number**: Absolute count of conversions per variant

**Winner Determination:**
- Winner is chosen from non-control variants with positive interval difference vs control
- Statuses: "too_early", "winner_found", "winner_not_found", "inconclusive"

### App User Integration

**AB Field Structure** (in `countly.app_users{appId}` documents):
```json
{
  "ab": [
    {
      "experiment_id": "5d4472152de8f07336f3b352",
      "variant_index": 1
    },
    {
      "experiment_id": "6f4472152de8f07336f3b353",
      "variant_index": 0
    }
  ]
}
```

**User Merge Behavior:**
- When users merge: Variant assignments consolidated
- Preference: Keep new user assignments, augment with old user's missing experiments
- Duplicate experiments resolved by keeping new user's variant
- Ab field deleted from old user after merge

## Use Cases

### 1. E-Commerce Conversion Optimization
Create button color and text variants to maximize add-to-cart conversions. Target desktop users in US only (geography drill filter). Track "Add to Cart" goal across 100% of users over 30 days. Determine highest-converting variant for rollout.

**Process:**
- Create experiment with 3 variants: blue button, red button, green button
- Set target condition: `{"up.c": "US"}` for country filtering
- Define goal: Track "add_to_cart" events
- Start experiment, run for 30 days, stop and view winner

### 2. Onboarding Flow A/B Testing
Test different onboarding sequences to reduce drop-off. Target new users only (day 0-1 since install). Test 3 different tutorial videos with identical conversion target.

**Process:**
- Create experiment with 3 onboarding variants
- Set target percentage: 100% (all new users)
- Define goal: Track "onboarding_complete" event
- Run experiment, track completion rates per variant
- Winner variant becomes default for new users

### 3. Feature Rollout with Statistical Validation
Release new feature to 25% of users with statistical verification before 100% rollout. Track both feature adoption and user engagement metrics.

**Process:**
- Create experiment with 2 variants: with feature, without feature
- Set target percentage: 25%
- Define multiple goals: feature_viewed, feature_used, user_engagement
- Run experiment, monitor conversion rates
- When a winner is found, rollout feature to everyone

### 4. Mobile Platform Variant Testing
Test different app behaviors by device type. Test push notification timing on iOS vs Android. Target by platform (Drill condition: `{"up.os": {"$in": ["iOS", "Android"]}}`)

**Process:**
- Create experiment for iOS users with timing variants
- Create separate experiment for Android users
- Run both simultaneously, compare notification open rates
- Choose timing per platform based on results

### 5. Free vs Premium Feature Comparison
Test advanced features with premium users only. Measure whether feature increases paid subscription retention. Target by subscription status (Drill filter: `{"custom.subscription": {"$eq": "premium"}}`)

**Process:**
- Create experiment with feature variants
- Set target condition for premium users only
- Track subscription renewal events as goal
- Determine if feature impacts retention
- Decide whether to expand feature to all premium users

## Configuration & Best Practices

### Performance Optimization

1. **Model Availability**: Verify required model files are present via `/o/ab-testing/check-models` before heavy experiment analysis
2. **Calculation Skipping**: Use `skipCalculation=true` on large result fetches if performance calculation not needed
3. **Keys Filtering**: Use `/o/sdk?method=ab_fetch_variants` with specific keys to reduce payload for SDKs
4. **Parameter Naming**: Use consistent, lowercase parameter names across experiments to avoid conflicts

### Experiment Design

1. **Sample Size**: Ensure target percentage captures sufficient users (>100/day for statistical power)
2. **Duration**: Run minimum 7 days to account for daily patterns; 30 days recommended for significant results
3. **Goal Definition**: Define clear conversion events; complex step sequences require more user volume
4. **Variant Count**: 2 variants (control + 1) minimum; more variants dilute sample sizes exponentially

### Safety Practices

1. **Parameter Isolation**: Each active experiment's first variant defines "system parameters" - avoid overlapping parameter names
2. **Autostop**: Improvement mode can auto-stop a running experiment when target conditions are met
3. **User Merge**: Accounts for duplicate user records, consolidated ab assignments maintained
4. **Cohort Cleanup**: Deleting experiment removes all associated auto-created cohorts to prevent data pollution

### Troubleshooting

- **"The parameter has been added to drafts or running experiments"**: Parameter name conflicts. Use unique names or wait for conflicting experiment to complete.
- **"The experiment could not be started"**: Cohort creation failed. Check drill conditions are valid and cohorts feature is enabled.
- **Winner not found**: Insufficient conversion data. Increase target percentage, extend duration, or use simpler conversion goals.
- **Models not built**: Required `.stan` model files are missing from the model directory.

## Related Features

- **Drill**: Required dependency for user segmentation via Drill filters in experiments
- **Cohorts**: Required for automatic goal tracking cohort creation
- **Remote Config**: Uses same variant assignment mechanics and hash-based distribution

## System Integration Points

### App Lifecycle
- **Create**: No AB experiments by default
- **Delete**: All AB experiments for the app are dropped by the `/i/apps/delete` hook
- **Reset**: All AB experiments cleared, data reset

### User Management
- **User Merge**: Consolidates AB variant assignments, preventing experiment conflicts
- **User Delete**: Removes user from all experiment tracking

### System Logs
- **ab_created**: Records when experiment created
- **ab_updated**: Records when experiment modified (draft only)
- **ab_started**: Records when experiment transitions to running
- **ab_stopped**: Records when experiment stopped manually
- **ab_deleted**: Records when experiment removed

### Data Import/Export
- Experiments included in app data exports
- Import validation currently returns success with ID mapping and does not enforce deep schema checks

## API Response Codes

| Code | Meaning |
|---|---|
| 200 | Successful operation |
| 400 | Invalid request parameters or state |
| 500 | Server error (database, cohort, or statistical model error) |

## Permissions & Authentication

Admin API endpoints require standard Countly authentication through `api_key` or `auth_token` (parameter or header). SDK-facing endpoints use `app_key`. Administrative privileges are required for:
- Creating, updating, or deleting experiments
- Starting or stopping experiments

Read-level access is limited to viewing experiments and fetching parameters.

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

_Last Updated: 2026-02-15_  
_Feature ID: ab-testing_  
_Enterprise_
