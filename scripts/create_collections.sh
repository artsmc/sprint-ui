#!/bin/bash
# Script to create all PocketBase collections for Sprint UI

TOKEN="$(cat /tmp/pb_token.txt)"
BASE_URL="http://localhost:8090/api/collections"

create_collection() {
  local name=$1
  local data=$2
  echo "Creating collection: $name"
  RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$data")

  if echo "$RESPONSE" | grep -q '"id"'; then
    echo "  Created successfully"
    echo "$RESPONSE" | jq -r '.id'
  else
    echo "  Error: $(echo $RESPONSE | jq -r '.message // .data')"
    return 1
  fi
}

# 1. challenges (no relations)
echo "=== Creating base collections (no relations) ==="
CHALLENGES_ID=$(create_collection "challenges" '{
  "name": "challenges",
  "type": "base",
  "fields": [
    {"name": "challenge_number", "type": "number", "required": true, "min": 1, "max": 999},
    {"name": "title", "type": "text", "required": true, "min": 1, "max": 255},
    {"name": "brief", "type": "editor", "required": true}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_challenge_number ON challenges (challenge_number)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}')

# 2. skills (no relations)
SKILLS_ID=$(create_collection "skills" '{
  "name": "skills",
  "type": "base",
  "fields": [
    {"name": "name", "type": "text", "required": true, "min": 1, "max": 80},
    {"name": "slug", "type": "text", "required": true, "min": 1, "max": 80, "pattern": "^[a-z0-9-]+$"},
    {"name": "description", "type": "text", "required": false, "max": 500}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_skill_slug ON skills (slug)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}')

# 3. badges (no relations)
BADGES_ID=$(create_collection "badges" '{
  "name": "badges",
  "type": "base",
  "fields": [
    {"name": "slug", "type": "text", "required": true, "min": 1, "max": 80, "pattern": "^[a-z0-9-]+$"},
    {"name": "name", "type": "text", "required": true, "min": 1, "max": 120},
    {"name": "description", "type": "text", "required": false, "max": 500},
    {"name": "icon_name", "type": "text", "required": false, "max": 80}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_badge_slug ON badges (slug)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}')

echo ""
echo "=== Creating collections with user relations ==="

# 4. sprints (depends on challenges, users)
SPRINTS_ID=$(create_collection "sprints" '{
  "name": "sprints",
  "type": "base",
  "fields": [
    {"name": "sprint_number", "type": "number", "required": true, "min": 1},
    {"name": "name", "type": "text", "required": true, "min": 1, "max": 255},
    {"name": "challenge_id", "type": "relation", "required": true, "collectionId": "challenges", "cascadeDelete": false, "maxSelect": 1},
    {"name": "status", "type": "select", "required": true, "maxSelect": 1, "values": ["scheduled", "active", "voting", "retro", "completed", "cancelled"]},
    {"name": "start_at", "type": "date", "required": false},
    {"name": "end_at", "type": "date", "required": false},
    {"name": "voting_end_at", "type": "date", "required": false},
    {"name": "retro_day", "type": "date", "required": false},
    {"name": "duration_days", "type": "number", "required": true, "min": 1, "max": 60},
    {"name": "started_by_id", "type": "relation", "required": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "maxSelect": 1},
    {"name": "ended_by_id", "type": "relation", "required": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "maxSelect": 1}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_sprint_number ON sprints (sprint_number)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}')

# 5. sprint_participants (depends on sprints, users)
SPRINT_PARTICIPANTS_ID=$(create_collection "sprint_participants" '{
  "name": "sprint_participants",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "joined_at", "type": "date", "required": true}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_sprint_user ON sprint_participants (sprint_id, user_id)"],
  "listRule": "@request.auth.id != \"\"",
  "viewRule": "@request.auth.id != \"\"",
  "createRule": "@request.auth.id != \"\" && @request.body.user_id = @request.auth.id",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.id = user_id || @request.auth.role = \"admin\""
}')

# 6. submissions (depends on sprints, users)
SUBMISSIONS_ID=$(create_collection "submissions" '{
  "name": "submissions",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "title", "type": "text", "required": true, "min": 1, "max": 255},
    {"name": "short_description", "type": "text", "required": false, "max": 500},
    {"name": "main_problem_focused", "type": "editor", "required": false},
    {"name": "key_constraints", "type": "editor", "required": false},
    {"name": "figma_url", "type": "url", "required": false},
    {"name": "status", "type": "select", "required": true, "maxSelect": 1, "values": ["draft", "submitted"]},
    {"name": "submitted_at", "type": "date", "required": false}
  ],
  "listRule": "@request.auth.id = user_id || sprint_id.status = \"voting\" || sprint_id.status = \"retro\" || sprint_id.status = \"completed\"",
  "viewRule": "@request.auth.id = user_id || sprint_id.status = \"voting\" || sprint_id.status = \"retro\" || sprint_id.status = \"completed\"",
  "createRule": "@request.auth.id != \"\" && @request.body.user_id = @request.auth.id",
  "updateRule": "@request.auth.id = user_id && sprint_id.status = \"active\"",
  "deleteRule": "@request.auth.id = user_id && status = \"draft\""
}')

echo ""
echo "=== Creating remaining collections ==="

# 7. submission_assets (depends on submissions)
create_collection "submission_assets" '{
  "name": "submission_assets",
  "type": "base",
  "fields": [
    {"name": "submission_id", "type": "relation", "required": true, "collectionId": "submissions", "cascadeDelete": true, "maxSelect": 1},
    {"name": "asset_type", "type": "select", "required": true, "maxSelect": 1, "values": ["image", "pdf", "zip"]},
    {"name": "file", "type": "file", "required": true, "maxSelect": 1, "maxSize": 20971520, "mimeTypes": ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "application/zip"]},
    {"name": "thumbnail", "type": "file", "required": false, "maxSelect": 1, "maxSize": 1048576, "mimeTypes": ["image/jpeg", "image/png", "image/webp"]},
    {"name": "sort_order", "type": "number", "required": true, "min": 1, "max": 99}
  ],
  "listRule": "submission_id.user_id = @request.auth.id || submission_id.sprint_id.status = \"voting\" || submission_id.sprint_id.status = \"retro\" || submission_id.sprint_id.status = \"completed\"",
  "viewRule": "submission_id.user_id = @request.auth.id || submission_id.sprint_id.status = \"voting\" || submission_id.sprint_id.status = \"retro\" || submission_id.sprint_id.status = \"completed\"",
  "createRule": "@request.auth.id != \"\" && submission_id.user_id = @request.auth.id",
  "updateRule": "submission_id.user_id = @request.auth.id && submission_id.sprint_id.status = \"active\"",
  "deleteRule": "submission_id.user_id = @request.auth.id"
}'

# 8. submission_skill_tags (depends on submissions, skills)
create_collection "submission_skill_tags" '{
  "name": "submission_skill_tags",
  "type": "base",
  "fields": [
    {"name": "submission_id", "type": "relation", "required": true, "collectionId": "submissions", "cascadeDelete": true, "maxSelect": 1},
    {"name": "skill_id", "type": "relation", "required": true, "collectionId": "skills", "cascadeDelete": true, "maxSelect": 1},
    {"name": "is_primary", "type": "bool", "required": false}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_submission_skill ON submission_skill_tags (submission_id, skill_id)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.id != \"\" && submission_id.user_id = @request.auth.id",
  "updateRule": "submission_id.user_id = @request.auth.id",
  "deleteRule": "submission_id.user_id = @request.auth.id"
}'

# 9. user_skill_progress (depends on users, skills, sprints)
create_collection "user_skill_progress" '{
  "name": "user_skill_progress",
  "type": "base",
  "fields": [
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "skill_id", "type": "relation", "required": true, "collectionId": "skills", "cascadeDelete": true, "maxSelect": 1},
    {"name": "sprint_id", "type": "relation", "required": false, "collectionId": "sprints", "cascadeDelete": false, "maxSelect": 1},
    {"name": "level", "type": "number", "required": true, "min": 1, "max": 100},
    {"name": "xp", "type": "number", "required": true, "min": 0}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_user_skill ON user_skill_progress (user_id, skill_id)"],
  "listRule": "@request.auth.id != \"\"",
  "viewRule": "@request.auth.id != \"\"",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}'

# 10. votes (depends on sprints, submissions, users)
create_collection "votes" '{
  "name": "votes",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "submission_id", "type": "relation", "required": true, "collectionId": "submissions", "cascadeDelete": true, "maxSelect": 1},
    {"name": "voter_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "rating_clarity", "type": "number", "required": true, "min": 1, "max": 5},
    {"name": "rating_usability", "type": "number", "required": true, "min": 1, "max": 5},
    {"name": "rating_visual_craft", "type": "number", "required": true, "min": 1, "max": 5},
    {"name": "rating_originality", "type": "number", "required": true, "min": 1, "max": 5}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_submission_voter ON votes (submission_id, voter_id)"],
  "listRule": "@request.auth.id != \"\"",
  "viewRule": "@request.auth.id != \"\"",
  "createRule": "@request.auth.id != \"\" && @request.body.voter_id = @request.auth.id && sprint_id.status = \"voting\" && submission_id.user_id != @request.auth.id",
  "updateRule": "@request.auth.id = voter_id && sprint_id.status = \"voting\"",
  "deleteRule": "@request.auth.id = voter_id && sprint_id.status = \"voting\""
}'

# 11. feedback (depends on sprints, submissions, users)
create_collection "feedback" '{
  "name": "feedback",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "submission_id", "type": "relation", "required": true, "collectionId": "submissions", "cascadeDelete": true, "maxSelect": 1},
    {"name": "author_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "works_well", "type": "editor", "required": false},
    {"name": "to_improve", "type": "editor", "required": false},
    {"name": "question", "type": "editor", "required": false},
    {"name": "is_anonymous", "type": "bool", "required": true}
  ],
  "listRule": "@request.auth.id != \"\"",
  "viewRule": "@request.auth.id != \"\"",
  "createRule": "@request.auth.id != \"\" && @request.body.author_id = @request.auth.id && (sprint_id.status = \"voting\" || sprint_id.status = \"retro\")",
  "updateRule": "@request.auth.id = author_id && (sprint_id.status = \"voting\" || sprint_id.status = \"retro\")",
  "deleteRule": "@request.auth.id = author_id"
}'

# 12. feedback_helpful_marks (depends on feedback, users)
create_collection "feedback_helpful_marks" '{
  "name": "feedback_helpful_marks",
  "type": "base",
  "fields": [
    {"name": "feedback_id", "type": "relation", "required": true, "collectionId": "feedback", "cascadeDelete": true, "maxSelect": 1},
    {"name": "marked_by_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_feedback_marker ON feedback_helpful_marks (feedback_id, marked_by_id)"],
  "listRule": "@request.auth.id != \"\"",
  "viewRule": "@request.auth.id != \"\"",
  "createRule": "@request.auth.id != \"\" && @request.body.marked_by_id = @request.auth.id",
  "updateRule": null,
  "deleteRule": "@request.auth.id = marked_by_id"
}'

# 13. xp_events (depends on users, sprints)
create_collection "xp_events" '{
  "name": "xp_events",
  "type": "base",
  "fields": [
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "source_type", "type": "select", "required": true, "maxSelect": 1, "values": ["read_brief", "submit_design", "vote", "feedback", "reflection", "helpful_feedback"]},
    {"name": "source_id", "type": "text", "required": false, "max": 50},
    {"name": "amount", "type": "number", "required": true}
  ],
  "listRule": "@request.auth.id = user_id || @request.auth.role = \"admin\"",
  "viewRule": "@request.auth.id = user_id || @request.auth.role = \"admin\"",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}'

# 14. user_sprint_tasks (depends on sprints, users)
create_collection "user_sprint_tasks" '{
  "name": "user_sprint_tasks",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "task_type", "type": "select", "required": true, "maxSelect": 1, "values": ["read_brief", "upload_design", "vote_on_peers", "leave_feedback", "reflection"]},
    {"name": "completed_at", "type": "date", "required": false}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_sprint_user_task ON user_sprint_tasks (sprint_id, user_id, task_type)"],
  "listRule": "@request.auth.id = user_id || @request.auth.role = \"admin\"",
  "viewRule": "@request.auth.id = user_id || @request.auth.role = \"admin\"",
  "createRule": "@request.auth.id != \"\" && @request.body.user_id = @request.auth.id",
  "updateRule": "@request.auth.id = user_id",
  "deleteRule": "@request.auth.role = \"admin\""
}'

# 15. user_badges (depends on users, badges, sprints)
create_collection "user_badges" '{
  "name": "user_badges",
  "type": "base",
  "fields": [
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1},
    {"name": "badge_id", "type": "relation", "required": true, "collectionId": "badges", "cascadeDelete": true, "maxSelect": 1},
    {"name": "sprint_id", "type": "relation", "required": false, "collectionId": "sprints", "cascadeDelete": false, "maxSelect": 1},
    {"name": "awarded_at", "type": "date", "required": true}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_user_badge_sprint ON user_badges (user_id, badge_id, sprint_id)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}'

# 16. sprint_retro_summaries (depends on sprints)
create_collection "sprint_retro_summaries" '{
  "name": "sprint_retro_summaries",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "submissions_count", "type": "number", "required": true, "min": 0},
    {"name": "votes_count", "type": "number", "required": true, "min": 0},
    {"name": "comments_count", "type": "number", "required": true, "min": 0},
    {"name": "what_was_good", "type": "editor", "required": false},
    {"name": "what_can_improve", "type": "editor", "required": false},
    {"name": "what_was_asked", "type": "editor", "required": false}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_retro_sprint ON sprint_retro_summaries (sprint_id)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}'

# 17. sprint_retro_resources (depends on sprints)
create_collection "sprint_retro_resources" '{
  "name": "sprint_retro_resources",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "title", "type": "text", "required": true, "min": 1, "max": 255},
    {"name": "url", "type": "url", "required": true},
    {"name": "resource_type", "type": "select", "required": true, "maxSelect": 1, "values": ["article", "video", "documentation", "tool"]}
  ],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}'

# 18. sprint_awards (depends on sprints, submissions, users)
create_collection "sprint_awards" '{
  "name": "sprint_awards",
  "type": "base",
  "fields": [
    {"name": "sprint_id", "type": "relation", "required": true, "collectionId": "sprints", "cascadeDelete": true, "maxSelect": 1},
    {"name": "award_type", "type": "select", "required": true, "maxSelect": 1, "values": ["top_visual", "top_usability", "top_clarity", "top_originality", "feedback_mvp", "most_improved", "participation_champion"]},
    {"name": "submission_id", "type": "relation", "required": true, "collectionId": "submissions", "cascadeDelete": true, "maxSelect": 1},
    {"name": "user_id", "type": "relation", "required": true, "collectionId": "_pb_users_auth_", "cascadeDelete": true, "maxSelect": 1}
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_sprint_award_type ON sprint_awards (sprint_id, award_type)"],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.role = \"admin\"",
  "updateRule": "@request.auth.role = \"admin\"",
  "deleteRule": "@request.auth.role = \"admin\""
}'

echo ""
echo "=== Done! ==="
echo "Created 18 collections (users already existed and was updated)"
