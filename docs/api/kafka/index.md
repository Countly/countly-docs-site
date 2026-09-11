---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Kafka

The **Kafka** feature integrates with Apache Kafka for real-time data streaming and event processing.

## Configuration & Settings

Kafka integration settings:
- **Brokers**: Kafka broker addresses
- **Topics**: Topic mapping for event types
- **Authentication**: SASL/SSL credentials

## API Endpoints

This feature does not expose user-facing API endpoints. It operates internally as part of Countly's core functionality.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `kafka_configs` | Kafka broker connection configurations |

</details>
