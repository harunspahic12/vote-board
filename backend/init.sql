-- Initialize the database schema
CREATE TABLE IF NOT EXISTS ideas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO ideas (title, description, votes) VALUES
    ('Add dark mode', 'Would be great to have a dark theme option', 15),
    ('Mobile app version', 'Create native mobile apps for iOS and Android', 23),
    ('Export to PDF', 'Allow exporting ideas list as PDF', 8);

