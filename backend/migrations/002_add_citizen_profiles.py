"""
Migration 002 - Add citizen_profiles table and update requests issuer_type/status values
"""

CREATE_CITIZEN_PROFILES = """
CREATE TABLE IF NOT EXISTS citizen_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    name VARCHAR NOT NULL,
    phone VARCHAR,
    address VARCHAR,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
"""

# No structural change needed for requests table — issuer_type and status are
# plain VARCHAR columns, so new values (citizen / pending / in_progress / done)
# are accepted without a schema change.

def upgrade(conn):
    conn.execute(CREATE_CITIZEN_PROFILES)


def downgrade(conn):
    conn.execute("DROP TABLE IF EXISTS citizen_profiles;")
