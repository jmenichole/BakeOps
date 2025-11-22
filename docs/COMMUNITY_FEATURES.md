# Community & Gallery Features

## Overview

BakeBuilder's community features transform the platform from a business tool into a thriving social network for bakers, increasing engagement, retention, and organic growth through baker-to-baker connections and customer inspiration browsing.

## Baker Gallery System

### Core Features

#### 1. Public Baker Gallery
Each baker has a public gallery showcasing their work:

**Gallery Features**:
- Unlimited cake photo uploads (Premium)
- Photo grid layout with filters
- Search by cake type, occasion, style
- Pin up to 5 favorite cakes to profile
- View count and like tracking
- Photo descriptions and tags
- Price range indicators (optional)

**Gallery URL Structure**:
```
bakebuilder.com/gallery/{baker-username}
bakebuilder.com/gallery/{baker-username}/{cake-id}
```

#### 2. Pinned Cakes
Bakers can highlight their best work:
- Select up to 5 cakes to pin to profile
- Pinned cakes appear first in gallery
- Showcase signature styles
- Update pins anytime
- Featured on baker profile page

#### 3. Customer Inspiration Browsing

**Browse Experience**:
```
┌─────────────────────────────────────────────┐
│  Browse Cake Galleries                      │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ Filter │ │  Sort  │ │ Search │          │
│  └────────┘ └────────┘ └────────┘          │
│                                             │
│  Wedding Cakes | Birthday | Custom         │
│  ─────────────────────────────────────     │
│                                             │
│  [Cake Image]  [Cake Image]  [Cake Image] │
│  3-Tier Wedding  Rainbow     Unicorn       │
│  by Sweet Dreams Birthday    Theme         │
│  ⭐ 245 likes   by Sugar     by Cake       │
│                 Magic        Studio        │
│                                             │
│  [Send Inspiration Request]                │
└─────────────────────────────────────────────┘
```

**Customer Actions**:
- Browse all galleries
- Filter by cake type, style, color, size
- Save favorite cakes to inspiration board
- Send inspiration request to baker
- See baker's availability
- Request quote based on gallery cake

#### 4. Inspiration Request System

When customer finds inspiring cake:
```json
{
  "inspirationRequest": {
    "cakeId": "uuid",
    "bakerId": "uuid",
    "customerId": "uuid",
    "message": "I love this design! Can you make similar for my wedding?",
    "desiredDate": "2025-06-15",
    "modifications": "Same style but in navy and gold",
    "budget": "500-700",
    "servings": 150
  }
}
```

Baker receives request in dashboard:
- Sees original cake photo
- Reads customer's modifications
- Can respond with:
  - Yes, with quote
  - Suggest alternatives
  - Decline if unavailable

## Social Feed Features

### Baker Feed (Community Timeline)

**Feed Types**:
1. **Following Feed**: Posts from bakers you follow
2. **Discover Feed**: Algorithm-based recommendations
3. **Local Feed**: Bakers in your area
4. **Trending**: Most engaged posts this week

**Post Types**:
- Completed cake showcase
- Work-in-progress photos
- Technique tutorials
- Business tips
- Question posts
- Celebration posts (milestone orders)

**Post Structure**:
```typescript
interface FeedPost {
  id: string;
  bakerId: string;
  type: 'showcase' | 'tutorial' | 'question' | 'milestone';
  images: string[];
  caption: string;
  tags: string[];
  cakeDetails?: {
    tiers: number;
    flavor: string;
    serves: number;
    hours: number;
  };
  stats: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
  createdAt: Date;
}
```

**Engagement Features**:
- ❤️ Like posts
- 💬 Comment with photos
- 🔖 Save to collections
- 🔗 Share to other platforms
- 👥 Tag other bakers
- #️⃣ Hashtags (#weddingcake #fondantwork)

### Following System

**Follow Features**:
- Follow other bakers for inspiration
- See follower/following counts on profile
- Follow suggestions based on location, style
- Notification when followed bakers post
- Private accounts option (Premium)

**Discovery**:
- Suggested bakers based on:
  - Similar cake styles
  - Geographic proximity
  - Mutual follows
  - Popular in your area
  - Trending this week

## Forum/Community Discussions

### Forum Structure

**Categories**:
1. **Techniques & Tips**
   - Fondant work
   - Sugar flowers
   - Buttercream techniques
   - Ganache & glazes
   - Structure & engineering

2. **Business & Pricing**
   - Pricing strategies
   - Dealing with difficult clients
   - Marketing tips
   - Time management
   - Legal & insurance

3. **Troubleshooting**
   - Common problems & solutions
   - Ingredient substitutions
   - Weather challenges
   - Last-minute fixes

4. **Show & Tell**
   - Share your work
   - Before & after
   - Failed attempts (learning)
   - Proud moments

5. **Equipment & Supplies**
   - Tool recommendations
   - Supplier reviews
   - DIY tools
   - Kitchen setup

### Forum Features

**Thread System**:
```
Question: "How to prevent fondant from cracking?"
  ↓
Answer 1 (⬆️ 24 votes) - "Add glycerin..."
  └─ Reply: "Tried this, worked perfectly!"
  
Answer 2 (⬆️ 15 votes) - "Temperature is key..."
  └─ Reply: "What temperature exactly?"
     └─ Reply: "68-72°F works best"

Answer 3 (⬆️ 8 votes) - "Use marshmallow fondant..."
```

**Features**:
- Upvote/downvote answers
- Mark as "Solved"
- Follow threads for updates
- Search by keywords
- Filter by category, solved, recent
- Expert baker badges
- Moderator controls

### Private Messaging

**DM System**:
- Direct messages between bakers
- Share photos/files
- Group messages (max 10)
- Message history
- Read receipts
- Typing indicators

**Premium Feature**:
- Free tier: View only, no DMs
- Premium: Unlimited messaging

## Database Schema

### Gallery Tables

```sql
-- Baker gallery photos
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Photo details
  title VARCHAR(255),
  description TEXT,
  tags TEXT[],
  cake_type VARCHAR(100),
  occasion VARCHAR(100),
  
  -- Metadata
  is_pinned BOOLEAN DEFAULT false,
  pin_order INT,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  
  -- Privacy
  is_public BOOLEAN DEFAULT true,
  
  -- Cake details
  cake_details JSONB,
  price_range VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_baker_id ON gallery_photos(baker_id);
CREATE INDEX idx_gallery_pinned ON gallery_photos(baker_id, is_pinned, pin_order);
CREATE INDEX idx_gallery_public ON gallery_photos(is_public);

-- Inspiration requests
CREATE TABLE inspiration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_photo_id UUID REFERENCES gallery_photos(id) ON DELETE SET NULL,
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Request details
  message TEXT NOT NULL,
  desired_date DATE,
  modifications TEXT,
  budget_range VARCHAR(50),
  servings INT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'viewed', 'quoted', 'accepted', 'declined', 'expired'
  )),
  
  -- Response
  baker_response TEXT,
  quote_id UUID REFERENCES quotes(id),
  
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inspiration_baker_id ON inspiration_requests(baker_id);
CREATE INDEX idx_inspiration_customer_id ON inspiration_requests(customer_id);
CREATE INDEX idx_inspiration_status ON inspiration_requests(status);
```

### Social Feed Tables

```sql
-- Feed posts
CREATE TABLE feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baker_id UUID NOT NULL REFERENCES bakers(id) ON DELETE CASCADE,
  
  -- Post content
  post_type VARCHAR(20) NOT NULL CHECK (post_type IN (
    'showcase', 'tutorial', 'question', 'milestone', 'tip'
  )),
  caption TEXT NOT NULL,
  images TEXT[],
  tags TEXT[],
  
  -- Cake details (optional)
  cake_details JSONB,
  
  -- Engagement
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  
  -- Visibility
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feed_posts_baker_id ON feed_posts(baker_id);
CREATE INDEX idx_feed_posts_created ON feed_posts(created_at DESC);
CREATE INDEX idx_feed_posts_public ON feed_posts(is_public);

-- Post likes
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- Post comments
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  
  comment_text TEXT NOT NULL,
  images TEXT[],
  
  likes_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);

-- Following system
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Saved posts
CREATE TABLE saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  collection_name VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
```

### Forum Tables

```sql
-- Forum categories
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum threads
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  
  -- Status
  is_solved BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  
  -- Stats
  views_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX idx_forum_threads_author ON forum_threads(author_id);
CREATE INDEX idx_forum_threads_activity ON forum_threads(last_activity_at DESC);

-- Forum replies
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  images TEXT[],
  
  -- Voting
  upvotes_count INT DEFAULT 0,
  downvotes_count INT DEFAULT 0,
  
  -- Status
  is_solution BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_replies_thread ON forum_replies(thread_id);
CREATE INDEX idx_forum_replies_author ON forum_replies(author_id);

-- Reply votes
CREATE TABLE reply_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID NOT NULL REFERENCES forum_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(reply_id, user_id)
);

CREATE INDEX idx_reply_votes_reply ON reply_votes(reply_id);

-- Direct messages
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  message_text TEXT NOT NULL,
  images TEXT[],
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender ON direct_messages(sender_id);
CREATE INDEX idx_messages_recipient ON direct_messages(recipient_id);
CREATE INDEX idx_messages_conversation ON direct_messages(sender_id, recipient_id);
```

## API Endpoints

### Gallery Endpoints

```http
# Upload gallery photo
POST /api/gallery/upload

# Get baker's gallery
GET /api/gallery/{bakerId}

# Get single gallery photo
GET /api/gallery/photos/{photoId}

# Update gallery photo
PUT /api/gallery/photos/{photoId}

# Delete gallery photo
DELETE /api/gallery/photos/{photoId}

# Pin/unpin photo
POST /api/gallery/photos/{photoId}/pin

# Like gallery photo
POST /api/gallery/photos/{photoId}/like

# Browse all galleries
GET /api/gallery/browse
  ?cakeType=wedding
  &occasion=birthday
  &style=modern
  &page=1

# Send inspiration request
POST /api/gallery/inspiration-request

# Get baker's inspiration requests
GET /api/gallery/inspiration-requests/{bakerId}

# Respond to inspiration request
PUT /api/gallery/inspiration-requests/{requestId}/respond
```

### Social Feed Endpoints

```http
# Create post
POST /api/feed/posts

# Get feed (personalized)
GET /api/feed
  ?type=following|discover|trending

# Get single post
GET /api/feed/posts/{postId}

# Update post
PUT /api/feed/posts/{postId}

# Delete post
DELETE /api/feed/posts/{postId}

# Like post
POST /api/feed/posts/{postId}/like

# Comment on post
POST /api/feed/posts/{postId}/comments

# Save post
POST /api/feed/posts/{postId}/save

# Follow baker
POST /api/feed/follow/{bakerId}

# Unfollow baker
DELETE /api/feed/follow/{bakerId}

# Get followers
GET /api/feed/followers/{bakerId}

# Get following
GET /api/feed/following/{bakerId}
```

### Forum Endpoints

```http
# List categories
GET /api/forum/categories

# Create thread
POST /api/forum/threads

# Get threads in category
GET /api/forum/categories/{categoryId}/threads

# Get single thread
GET /api/forum/threads/{threadId}

# Reply to thread
POST /api/forum/threads/{threadId}/replies

# Vote on reply
POST /api/forum/replies/{replyId}/vote

# Mark as solution
POST /api/forum/replies/{replyId}/mark-solution

# Search forum
GET /api/forum/search?q=fondant+cracking

# Send direct message
POST /api/messages/send

# Get conversations
GET /api/messages/conversations

# Get messages with user
GET /api/messages/{userId}

# Mark as read
PUT /api/messages/{messageId}/read
```

## Matching Service (Future)

### Baker-Customer Matching Algorithm

**Factors for Matching**:
1. **Location**: Distance between baker and customer
2. **Style Match**: Customer preferences vs baker's gallery
3. **Availability**: Baker's calendar openings
4. **Price Range**: Customer budget vs baker's typical pricing
5. **Specialization**: Wedding, birthday, corporate, etc.
6. **Ratings**: Customer reviews and ratings
7. **Response Time**: How quickly baker responds
8. **Completion Rate**: % of accepted orders completed

**Matching Flow**:
```
1. Customer creates request:
   - Desired cake style
   - Date needed
   - Budget range
   - Location
   - Special requirements

2. System finds matching bakers:
   - Within delivery radius
   - Available on desired date
   - Similar style in gallery
   - Price range matches

3. Customer sees top 5-10 matches:
   - Gallery photos
   - Ratings & reviews
   - Availability
   - Estimated price
   - Response time

4. Customer sends requests to favorites

5. Bakers respond with quotes

6. Customer chooses and books
```

## Monetization

### Free Tier
- View all galleries (read-only)
- View feed (read-only)
- Browse forum (read-only)
- 5 gallery photos max
- No posting to feed
- No forum posts/replies
- No direct messages

### Premium Tier ($49/month or $470/year)
- ✅ Unlimited gallery photos
- ✅ Pin up to 5 photos
- ✅ Post to feed (unlimited)
- ✅ Create forum threads
- ✅ Reply to forums
- ✅ Direct messaging
- ✅ Advanced gallery analytics
- ✅ Priority in matching algorithm
- ✅ Remove "Powered by BakeBuilder" branding
- ✅ Custom gallery URL

## Engagement Metrics

### Track Success
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Posts per day
- Comments per post
- Inspiration requests sent
- Inspiration → Order conversion
- Forum threads created
- Forum replies per thread
- Average session time
- Return visit rate

## Moderation

### Content Moderation
- AI-based inappropriate content detection
- User reporting system
- Moderator dashboard
- Ban/suspend users
- Remove posts/comments
- Warning system (3 strikes)

### Community Guidelines
- Be respectful and professional
- No spam or self-promotion (outside designated areas)
- No copyrighted images without permission
- No hate speech or harassment
- Stay on topic
- No solicitation in DMs

## Implementation Priority

### Phase 1 (MVP)
- Gallery upload and display
- Pin photos to profile
- Basic inspiration requests

### Phase 2
- Social feed (posts, likes, comments)
- Following system
- Feed algorithm

### Phase 3
- Forum categories and threads
- Reply voting
- Search functionality

### Phase 4
- Direct messaging
- Advanced matching algorithm
- Community features (badges, reputation)

This creates a sticky, engaging platform where bakers build community while growing their businesses!
