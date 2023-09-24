# SocialCircle

SocialCircle is a social networking platform where users can create posts, like and comment on them, and connect with other users.

## Getting Started

To get started with the project, you can follow these steps:

1. Clone the repository:  
   git clone <repo-url>

2. Install the dependencies:  
   npm install / yarn install

3. Create a `.env` file in the root directory of the project with the following contents:  
   SERVER_PORT=8080  
   JWT_SECRET_KEY=mysecretkey  
   NODE_ENV=dev  
   DATABASE_URL=your_db_connection_string_here

4. Start the server:  
   npm run start:dev

The server will start on port `8080`.

## Endpoints

The following endpoints are available in the project:

### Authentication

- `POST /api/v1/users/register`: Register a new user.
- `POST /api/v1/users/login`: Login a user.

### Profile

- `GET /api/v1/users/me`: Get the profile of a user.
- `PUT /api/v1/users/me`: Update the profile of a user.
- `DELETE /api/v1/users/me`: Delete the profile of a user.

### Posts

- `POST /api/v1/posts/create`: Create a new post.
- `DELETE /api/v1/posts/delete/:postId`: Delete a post.
- `PUT /api/v1/posts/update/:postId`: Update a post.
- `GET /api/v1/posts/my-posts`: Get the posts of the authenticated user.

### Likes

- `POST /api/v1/posts/like/:postId`: Like a post.

## Technologies Used

The following technologies were used in the project:

- Node.js
- Express.js
- Typescript
- Prisma ORM
- PlanetScale MySQL

## License

This project is licensed under the MIT License.
