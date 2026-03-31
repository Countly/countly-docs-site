---
sidebar_position: 1
sidebar_label: "Overview"
---

# Content - API Documentation

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

**Feature**: content  
**Type**: Enterprise  
**Total Endpoints**: 12  
**Last Updated**: February 15, 2026

---

## Overview

The Content Feature provides a comprehensive content management and delivery system for creating, managing, and delivering rich content blocks (banners, modals, carousels, surveys) to your application users. It features visual content builder, asset management with image compression and thumbnailing, engagement queue-based delivery targeting, multi-device preview and positioning, language localization support, and seamless integration with journey engine for orchestrated customer experiences.

**Perfect for:**
- In-app marketing campaigns
- Onboarding flows
- Feature announcements
- User engagement orchestration
- Survey distribution
- Personalized messaging

---

## Quick Links

| Endpoint | Purpose |
|----------|---------|
| [Content Blocks - Read](blocks-read.md) | Retrieve all or specific content blocks |
| [Content Blocks - Create](blocks-create.md) | Create new content block |
| [Content Blocks - Update](blocks-update.md) | Update existing content block |
| [Content Blocks - Delete](blocks-delete.md) | Delete content block |
| [Assets - Read](assets-read.md) | List all assets for application |
| [Assets - Upload](assets-upload.md) | Upload image asset |
| [Assets - Update](assets-update.md) | Update asset metadata |
| [Assets - Delete](assets-delete.md) | Delete asset |
| [Positioning - Calculate](positioning-calculate.md) | Calculate widget positioning for devices |
| [Languages - Read](languages-read.md) | Get eligible languages for localization |
| [Queue - Debug](queue-debug.md) | Get queue status for user |
| [SDK Read - Content Delivery](delivery-retrieve.md) | Fetch queued content for user (SDK) |

---

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.content_blocks` | Stores content block definitions (layout, blocks, styling, metadata) |
| `countly.content_queue` | User-specific content delivery queue with priority and expiry |
| `countly_fs.content_assets{app_id}.files` | GridFS file metadata for uploaded assets |
| `countly_fs.content_assets{app_id}.chunks` | GridFS binary chunks for uploaded assets |
| `countly.feedback_widgets` | Survey widget definitions (integration with surveys feature) |
| `countly.journey_versions` | Journey template versions (journey engine integration) |
| `countly.journey_definition` | Journey definitions (journey engine integration) |
| `countly.app_users{app_id}` | User state tracking content engagement |
| `countly.members` | User profiles (content creator information) |

---

## Configuration & Settings

Content behavior is mostly driven by content definitions and queue entries, with cooldown timing read from plugin configuration:

- **Content Types**: banner, modal, carousel, survey (extensible)
- **Asset Limits**: Maximum 5MB per asset file
- **Thumbnail Dimensions**: Max 400×400px with automatic resizing and compression
- **Image Formats Supported**: JPEG (80% quality), PNG (8-bit palette, compression level 8)
- **Queue Expiry**: Configurable per content block delivery
- **Queue Cooldown**: Read from `journey_engine.cooldown` with fallback from `content.cooldown` during migration logic
- **Priority Values**: Numeric values are stored in queue entries; selection order is determined by queue sorting logic

---

## Feature Categories

### 📋 Content Block Management (4 endpoints)

Manage content block definitions including creation, editing, viewing, and deletion.

- [Content Blocks - Read](blocks-read.md): Retrieve all content blocks or fetch by ID
- [Content Blocks - Create](blocks-create.md): Create new content block
- [Content Blocks - Update](blocks-update.md): Update existing content block  
- [Content Blocks - Delete](blocks-delete.md): Delete content block

### 🖼️ Asset Management (4 endpoints)

Upload, manage, and organize image assets with automatic compression and thumbnail generation.

- [Assets - Read](assets-read.md): List all assets with metadata and thumbnails
- [Assets - Upload](assets-upload.md): Upload image/video with compression (5MB max)
- [Assets - Update](assets-update.md): Update asset name and tags
- [Assets - Delete](assets-delete.md): Delete asset from storage

### 🎯 Positioning & Preview (1 endpoint)

Calculate responsive layout positioning for multiple device types simultaneously.

- [Positioning - Calculate](positioning-calculate.md): Calculate iframe dimensions for device preview

### 🌐 Localization (1 endpoint)

Support multi-language content delivery with automatic language detection.

- [Languages - Read](languages-read.md): Get eligible languages for content translation

### 📦 Queue Management & Delivery (2 endpoints)

Manage user content delivery queue and debug queue state.

- [Queue - Debug](queue-debug.md): Get queue status and pending blocks for user
- [SDK Read - Content Delivery](delivery-retrieve.md): Fetch next queued content for user (SDK endpoint)

---

## Content Block Structure

### Block Definition Format

```json
{
  "type": "modal|banner|carousel|survey",
  "layout": "centered|full|custom",
  "blocks": [
    {
      "type": "text|button|image|carousel-item",
      "content": "HTML content or text",
      "styling": {
        "backgroundColor": "#ffffff",
        "textColor": "#000000",
        "fontSize": 16,
        "padding": 20
      },
      "action": {
        "type": "open_url|close|custom_action",
        "value": "url or action identifier"
      },
      "placement": {
        "small": {"position": "center", "heightMultiplier": 1},
        "medium": {"position": "bRight", "heightMultiplier": 0.8},
        "large": {"position": "bRight", "heightMultiplier": 0.8}
      }
    }
  ],
  "details": {
    "title": "Content Block Title",
    "created": 1567474533960,
    "updated": 1567474533960,
    "creatorId": "5d4472152de8f07336f3b100",
    "favorite": false
  }
}
```

### Content Queue Entry

```json
{
  "_id": ObjectID,
  "app_id": "5be987d7b93798516eb5289a",
  "uid": "user_123",
  "app_user_id": "5d4472152de8f07336f3b200",
  "content_id": "5d4472152de8f07336f3b352",
  "priority": 1,
  "expiry": 1567474533960,
  "journey_id": "5d4472152de8f07336f3b400",
  "meta": {
    "journeyDefinitionId": "5d4472152de8f07336f3b450",
    "journeyId": "5d4472152de8f07336f3b451"
  }
}
```

---

## Key Concepts

### Engagement Queue System

**Queue-Based Delivery:**
- Users have personal content delivery queue stored per user
- Content blocks entered queue with priority and expiry
- SDK endpoint fetches next eligible queued block on user request
- Queue retrieval uses `peek` (item is not removed by `/o/sdk/content` itself)
- Block expires automatically after specified timestamp

**Priority Levels:**
- `0`: Highest priority (urgent announcements)
- `1`: High priority (important updates)
- `2`: Medium priority (regular content)
- `3`: Low priority (optional content, default)

### Asset Management & Storage

**GridFS Integration:**
- Images stored in GridFS (distributed file storage) per app
- Automatic compression: JPEG 80%, PNG 8-bit palette
- Thumbnail generation: Max 400×400px, stored as Base64 metadata
- 5MB maximum per asset
- Supports tags and dimensions metadata

**Image Processing:**
- Input validation on file size
- Compression applied per format (JPEG quality, PNG palette)
- Thumbnail auto-generated from full image or provided base64
- Base64 thumbnail stored in metadata for rapid display

### Multi-Device Positioning

**Device Types:**
- Small: Mobile phones (base dimensions)
- Medium: Tablets (medium scale)
- Large: Desktops (full scale)

**Responsive Layout:**
- Separate placement config per device type
- Height multiplier scales container proportionally
- Full-screen override for modal behavior on specific device types
- Calculations account for safe areas and viewport constraints

### Journey Integration

**Journey Engine Connectivity:**
- Content blocks referenced in journey definitions
- Queue entries track journey context
- Content delivery preserves journey instance tracking
- Deletion checks prevent orphaned journey references
- Journey queue clearing on completion/deletion

---

## Use Cases

### 1. In-App Marketing Campaign
Deliver targeted promotional banners and modals to user segments based on behavior and demographics. Schedule expiry to limit campaign duration automatically.

### 2. Feature Announcement & Onboarding
Introduce new features with interactive modals and carousels. Guide users through feature setup with sequential content blocks in queue.

### 3. Survey Deployment
Deliver surveys to specific user cohorts at optimal times with device-aware positioning.

### 4. Multi-Device Content Experience
Create responsive content that adapts positioning and sizing for phone, tablet, and desktop simultaneously. Use preview tool to verify appearance.

### 5. Journey-Orchestrated Experience
Orchestrate multi-step customer journeys with sequential content delivery. Automatically clean up queue when journey completes.

---

## Related Features

- **Journey Engine**: Orchestrates content delivery through journeys; integrates queue system
- **Surveys Feature**: Survey widget integration; content blocks can embed surveys
- **Analytics/Drill**: Tracks content engagement events

---

## Permissions & Authentication

All endpoints require user authentication and feature access:
- **Read endpoints** (`/o/content*`): Require `validateRead` with `content` feature permission
- **Write endpoints** (`/i/content*`): Require `validateCreate`, `validateUpdate`, or `validateDelete` based on operation
- **SDK endpoint** (`/o/sdk/content`): Internal authentication
- **Internal endpoints**: No authentication required (called by system/features only)

---

## Troubleshooting

### Common Issues

**Content block not appearing:**
- Check queue status via Queue - Debug endpoint
- Verify expiry timestamp is in future
- Confirm user resolution parameters valid
- Test resolution format in SDK Read - Content Delivery endpoint

**Asset upload failures:**
- Verify file size < 5MB
- Check file format (JPEG/PNG supported)
- Confirm app_id is correct
- Review error message for specific cause

**Positioning incorrect on device:**
- Use Positioning - Calculate endpoint to verify geometry
- Check device type classification (small/medium/large)
- Verify heightMultiplier and fullScreenOverride settings
- Test on actual device after preview

**Queue not clearing on journey deletion:**
- Verify journey engine feature enabled
- Check content_queue collection for orphaned entries
- Review system logs for errors

---

## Performance Optimization

### Asset Optimization

1. **Image Format Selection:**
   - JPEG: Photos and complex images (compresses to 80% quality)
   - PNG: Icons, logos, graphics with transparency (8-bit palette)

2. **Asset Size:** Optimize before upload to stay under 5MB limit

3. **Naming Convention:** Use descriptive names with tags for organization

### Queue Management

1. **Priority Assignment:** Define and use a consistent numeric priority convention across your team

2. **Expiry Configuration:** Set expiry to campaign end date; expired blocks auto-remove

3. **Queue Debugging:** Use Queue - Debug endpoint to inspect queue state during testing

### Content Design

1. **Device Testing:** Always preview on small, medium, large using Positioning - Calculate

2. **Responsive Heights:** Adjust heightMultiplier (0.6-1.2) for optimal appearance

---

## Conclusion

The Content Feature provides enterprise-grade content management and delivery with flexible queuing, multi-device preview, asset optimization, and seamless journey integration. Its responsive positioning system and language localization support enable global campaigns while maintaining optimal user experience across all device types.

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

**Last Updated**: 2026-02-15
