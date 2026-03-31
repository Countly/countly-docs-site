---
sidebar_label: "Overview"
sidebar_position: 1
---

# Surveys

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Surveys feature enables comprehensive user feedback collection through customizable surveys and Net Promoter Score (NPS) surveys. Capture user satisfaction, collect feedback, and measure customer loyalty through targeted survey campaigns and targeted NPS surveys with advanced targeting and response analytics.

---

## Key Features

- **Survey Types**: Traditional surveys and NPS (Net Promoter Score) widgets
- **Targeting**: Segment surveys by user properties and cohorts
- **Appearance Customization**: Brand surveys with custom colors, logos, and positioning
- **Response Tracking**: Detailed response analytics and completion rates
- **Multi-Question Support**: Complex surveys with multiple question types
- **Consent Management**: Optional consent field for GDPR compliance
- **Delivery Methods**: SDK-based and journey-engine delivery integration
- **Response Analysis**: Question-level analytics and response filtering

---

## Survey Types

### Survey
Traditional customer feedback surveys with multiple question types and custom branching logic.

### NPS (Net Promoter Score)
Standardized 0-10 rating scale measuring customer loyalty with automatic categorization:
- **Promoters** (9-10): Loyal, enthusiastic customers
- **Passives** (7-8): Satisfied but not loyal
- **Detractors** (0-6): Unhappy customers

---

## Configuration Settings

These settings control survey appearance and behavior:

| Setting | Default | Description |
|---------|---------|-------------|
| `main_color` | `#0166D6` | Primary color for survey UI |
| `font_color` | `#0166D6` | Font color for survey text |
| `feedback_logo` | Empty | Global logo stored in GridFS |

---

## Database Collections

- **Collection**: `countly.feedback_widgets`
  - Stores survey/NPS widget definitions and configuration
- **Collection**: `countly.completed_surveys{app_id}`
  - Tracks which users have responded to which surveys
- **Collection**: `countly_drill.drill_events`
  - Stores survey responses as events ([CLY]_survey, [CLY]_nps)
- **Collection**: `countly.members`
  - Referenced for survey creator information (via join)
- **Collection**: `countly.apps`
  - Referenced for application timezone and metadata

---

## API Endpoints

### Read Endpoints
- [Surveys - Survey Widget](survey-widget.md) - GET `/o/surveys/survey/widget`
- [Surveys - NPS Widget](nps-widget.md) - GET `/o/surveys/nps/widget`
- [Surveys - Survey Widgets](survey-widgets.md) - GET `/o/surveys/survey/widgets`
- [Surveys - NPS Widgets](nps-widgets.md) - GET `/o/surveys/nps/widgets`
- [Surveys - Survey Overview Metrics](survey-overview.md) - GET `/o/surveys/survey/overview`
- [Surveys - NPS Overview Metrics](nps-overview.md) - GET `/o/surveys/nps/overview`
- [Surveys - Survey Data](survey-data.md) - GET `/o/surveys/survey/data`
- [Surveys - NPS Data](nps-data.md) - GET `/o/surveys/nps/data`
- [Surveys - Question Map](question-map.md) - GET `/o/surveys/survey/question_map`

### Write Endpoints
- [Surveys - Create Survey](survey-create.md) - POST `/i/surveys/survey/create`
- [Surveys - Create NPS](nps-create.md) - POST `/i/surveys/nps/create`
- [Surveys - Edit Survey](survey-edit.md) - POST `/i/surveys/survey/edit`
- [Surveys - Edit NPS](nps-edit.md) - POST `/i/surveys/nps/edit`
- [Surveys - Delete Survey](survey-delete.md) - POST `/i/surveys/survey/delete`
- [Surveys - Delete NPS](nps-delete.md) - POST `/i/surveys/nps/delete`
- [Surveys - Update Survey Status](survey-status-update.md) - POST `/i/surveys/survey/status`
- [Surveys - Update NPS Status](nps-status-update.md) - POST `/i/surveys/nps/status`
- [Surveys - Upload Logo](upload-logo.md) - POST `/i/feedback/upload`

---

## Widget Lifecycle

1. **Creation**: Define survey name, questions, appearance, targeting
2. **Configuration**: Set user segments, display rules, delivery methods
3. **Publishing**: Enable survey for users to see and respond to
4. **Response Collection**: Survey widget displays to targeted users
5. **Analytics**: View responses, completion rates, NPS scores
6. **Editing**: Modify survey parameters while active
7. **Archiving**: Disable survey to stop new responses

---

## Targeting Options

Surveys can be targeted by:
- **User Properties**: Country, OS, device type, custom properties
- **Cohorts**: Pre-defined user segments
- **Display Timing**: On session start, on specific event, on timer
- **Show Rules**:
  - `uSubmit`: Show on any user action
  - `uAlways`: Always show (even if already responded)
  - `uClose`: Show only when user closes previous response

---

## Response Fields

Surveys track:
- **Shown Count**: How many times survey presented to users
- **Responded Count**: How many times users submitted responses
- **Response Rate**: Percentage of shown that were responded
- **NPS Scores** (NPS only):
  - Promoter %: Users rating 9-10
  - Passive %: Users rating 7-8
  - Detractor %: Users rating 0-6
  - NPS Score: Promoter % - Detractor %

---

## Authentication Requirements

All survey endpoints require:
- **Feature Permission**: `surveys` feature enabled for user
- **App Access**: User must have appropriate access to app
- **Method**: GET or POST (both accepted)
- **Permission Levels**:
  - Read: View survey data and responses
  - Create/Update: Create and modify surveys
  - Delete: Remove surveys and responses

---

## Related Features

- **[Cohorts](../../cohorts/api/index.md)** - Segment users for survey targeting
- **[Journey Engine](../../journey_engine/api/index.md)** - Deliver surveys via automated journeys

---

## Common Use Cases

1. **Post-Interaction Survey**: Get feedback after purchase
2. **Customer Loyalty Tracking**: Regular NPS surveys to monitor satisfaction
3. **Feature Feedback**: Collect feedback on new features
4. **Churn Prevention**: Targeted surveys to at-risk users
5. **User Onboarding Feedback**: Collect feedback on onboarding experience
6. **Product Research**: Launch surveys before feature development
7. **Support Quality Rating**: Rate support interactions

---

## Best Practices

- **Survey Frequency**: Limit survey exposure to avoid user fatigue
- **Question Count**: Keep surveys short (3-5 questions ideal)
- **Targeting**: Use cohorts to target relevant user segments
- **Response Incentives**: Consider offering value for survey completion
- **Timing**: Show surveys at appropriate moments in user journey
- **Testing**: A/B test survey wording and timing for optimization
- **Analysis**: Review responses regularly to inform product decisions

---

## Performance Considerations

- Survey rendering done client-side via SDK (minimal server load)
- Response analytics aggregated from drill events
- Large response datasets paginated for performance
- NPS calculations performed on aggregated data
- Targeting filtering applied before widget display

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions
