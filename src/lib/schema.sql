-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'member', -- 'admin', 'member', 'executive'
    handicap DECIMAL(4, 1) DEFAULT 0.0,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rounds/Schedule Table
CREATE TABLE IF NOT EXISTS rounds (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    round_date DATE NOT NULL,
    location VARCHAR(100) DEFAULT '라싸CC',
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'completed', 'cancelled'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RSVP Table
CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    round_id INTEGER REFERENCES rounds(id),
    name VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'attend', -- 'attend', 'absent', 'maybe'
    sponsor_item TEXT,
    comment TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(100) NOT NULL, -- Cloudinary public_id
    url TEXT NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Initial Round Data (5월, 10월)
INSERT INTO rounds (title, round_date, description) VALUES 
('5월 대항식 라운드', '2026-05-27', '시즌 오픈 정기 라운딩'),
('10월 납회식 라운드', '2026-10-31', '시즌 종료 정기 라운딩');
