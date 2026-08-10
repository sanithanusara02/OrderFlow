# Decisions Log

A running record of technical decisions made on OrderFlow, why they were made, what alternatives were considerd, and what trade offs were accepted.

## [15/07/2026] .gitignore - excluding node_modules and .env

**Context:** The backend needed a way to exclude two kinds of files from git:
generated dependency code, and files containing secrets.

**Decision:** Added a .gitignore excluding node_modules/ and .env.

node_modules/ is excluded because it's a derived artifact, not source it's fully regenerable from package.json via `npm install`, so committing it means storing a copy of something that shouldn't need to be stored.

.env is excluded because it will hold real secrets (database connection
  string) once created. Committing it would leak credentials into git
  history permanently, visible to anyone with repo access.

**Alternatives considered:** Committing everything as is. Rejected bloats the repo with regenerable files, and risks leaking secrets if .env
is ever added to it.

**Trade offs accepted:** Anyone cloning the repo can't run it immediately they need to run `npm install` themselves and create their own .env file.
This is why .env.example exists: to document which variables are needed
without exposing real values.

## [29/07/2026] Reference vs. Embed — Order relationships

**Context:** Order.js needed to relate to Customer, Restaurant, and Rider
documents, and also needed to store a delivery location. MongoDB offers
two ways to relate data: reference (store just the _id, look up full data
via .populate() when needed) or embed (copy the actual data directly into
the document).

**Decision:** customer, restaurant, and rider are stored as ObjectId
references. deliveryLocation is embedded directly as a lat/lng snapshot,
even though the customer already has a savedAddress field.

**Alternatives considered:** Embedding customer/restaurant/rider data
directly into each order (copying name, address, etc.) was considered
and rejected — these are independent entities that change over time
(e.g. a rider's availability, a restaurant closing), and embedding would
mean every order holds its own stale copy that drifts out of sync unless
manually kept updated everywhere. Referencing deliveryLocation back to
customer.savedAddress instead of embedding it was also considered and
rejected — if the customer's saved address changes later, a past order
should still show where it actually went, not silently update to the
new address.

**Trade-offs accepted:** Referencing customer/restaurant/rider means
reading an order with full actor details (e.g. the customer's name)
requires an extra database lookup via .populate(), rather than the data
being immediately available. Embedding deliveryLocation means that data
lives in two places (the customer's saved address, and each order's
snapshot) and could theoretically be inconsistent — but that's the point:
they're supposed to diverge over time, so this isn't really a bug, it's
the intended behavior.