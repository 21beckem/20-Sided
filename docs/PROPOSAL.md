# Team Project Proposal: The Dragon's Quill

## Project Description

**The Dragon's Quill** is a Dungeons & Dragons focused web application built around virtual tabletop functionality. The platform enables D&D players and Dungeon Masters to create, manage, and share interactive maps for their gaming sessions in real-time.

### What Problem Does It Solve?

The Dragon's Quill addresses the need for an accessible, web-based virtual tabletop that allows DMs to:
- Create and customize battle maps and dungeon layouts
- Build reusable map components for faster map creation
- Share maps with the community
- Host live play sessions where players can view maps in real-time through shareable links

## Team Members

- Michael Becker
- Peter Ashworth
- Uche Oranye
- Luke Campbell

## Technologies

### Frontend
- **HTML5** - Structure and markup
- **CSS** - Styling and responsive design
- **Vanilla JavaScript** - DOM manipulation and interactivity
- **Svelte** - Reusable UI components
- **Fetch API** - HTTP communication with backend
- **THREEjs** - 3D Map visualization
- **[PlayroomKit](https://joinplayroom.com/)** - Live json object sharing between map host and viewers

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for data persistence

### Development Tools
- **Git/GitHub** - Version control
- **Project Management Tool** - [Trello](https://trello.com/b/qQcDzcdq/dd-project-board)

## Team Management & Communication Strategy

### Version Control
- Git workflow with feature branches
- Pull request reviews before merging
- Regular commits with meaningful messages

### Communication Channels
- Microsoft Teams

## Core Features

1. **User Authentication**
   - Account register and login
   - Google O-Auth
   - Session management

2. **Map Builder**
   - Grid-based map creation interface
   - Drag-and-drop functionality
   - Basic terrain and object placement
   - Map naming and description

3. **Map Management**
   - Save maps to personal collection
   - Edit existing maps
   - Duplicate maps
   - Delete maps
   - View all saved maps

4. **Map Chunks (Reusable Components)**
   - Save portions of maps as reusable chunks
   - Browse personal chunk library
   - Place chunks onto new maps
   - CRUD operations for chunks

5. **Public Sharing**
   - Mark maps as public/private
   - Browse community shared maps
   - Duplicate public maps to personal collection

6. **Play Sessions**
   - Start a play session with a specific map
   - Generate shareable link for players
   - Players can view map in real-time
   - Basic session management (start/end)

## Additional Features (Stretch Goals)

- **Export/Import**: Save maps as JSON for backup/sharing
- **Token Management**: Place and move character tokens on maps
- **Fog of War**: Hide/reveal portions of the map during play
- **Drawing Tools**: Add temporary markers, lines, or notes during sessions
- **Dice Roller**: Integrated dice rolling functionality
- **Map Templates**: Pre-built map templates for common scenarios
- **Mobile Responsiveness**: Optimized experience for tablets/phones

## Wireframes/Mockups

(To be added)

## Database Schema


### Map Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  owner: ObjectId (ref: User),
  isPublic: Boolean (default: false),
  map: Mixed (JSON structure representing map layout),
  createdAt: Date,
  updatedAt: Date
}
```


## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Maps
- `GET /api/maps` - Get all maps for current user
- `GET /api/maps/:id` - Get specific map
- `POST /api/maps` - Create new map
- `PUT /api/maps/:id` - Update map
- `DELETE /api/maps/:id` - Delete map
- `GET /api/maps/public` - Get all public maps

### Map Chunks
- `GET /api/chunks` - Get all chunks for current user
- `GET /api/chunks/:id` - Get specific chunk
- `POST /api/chunks` - Create new chunk
- `PUT /api/chunks/:id` - Update chunk
- `DELETE /api/chunks/:id` - Delete chunk

## Project Requirements Checklist

### Technical Requirements
- ✅ Frontend: HTML, CSS, Vanilla JavaScript, Svelte
- ✅ DOM manipulation and form input flows
- ✅ Responsive design
- ✅ Backend: Node.js and Express
- ✅ RESTful API with 4+ distinct endpoints
- ✅ MongoDB for data storage
- ✅ Error handling and input validation
- ✅ Frontend-backend communication via Fetch API
- ✅ Full CRUD interactions
- ✅ Authentication (session-based or token-based)

### Minimum Features
- ✅ Clear user purpose (virtual tabletop for D&D)
- ✅ Multiple user interfaces (map builder, collections)
- ✅ Project README with required sections


## Timeline

### Week 1-2: Foundation
- Setup project structure
- Implement authentication
- Basic map creation interface
- Database setup and models

### Week 3: Core Features
- Complete map CRUD operations
- Implement map chunks functionality
- Public sharing features

### Week 4: Play Sessions
- Session management
- Shareable links
- Real-time map viewing

### Week 5: Polish & Deployment
- Bug fixes and testing
- UI/UX improvements
- Documentation
- Deployment preparation
- Final presentation

## Success Criteria

The project will be considered successful when:
1. Users can create accounts and authenticate
2. DMs can create, save, and edit maps
3. Maps can be shared publicly
4. All core CRUD operations function correctly
5. Application is responsive and user-friendly

## Notes

This proposal serves as the initial plan for The Dragon's Quill project. We understand that requirements and features may evolve as we begin implementation and discover technical constraints or opportunities. We will maintain flexibility while staying focused on delivering the core features outlined above.