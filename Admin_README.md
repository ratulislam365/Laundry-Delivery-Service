# Laundry Delivery Service - Admin API

Welcome to the Admin Panel API documentation. This guide provides all the necessary information for developers working on the admin-facing features of the Laundry Delivery Service backend.

## 1. Overview

The Admin API provides protected endpoints for managing users, orders, and other core functionalities of the application. All admin routes are grouped under the `/api/admin` prefix and require special authentication.

## 2. Authentication

Admin endpoints are protected by two layers of middleware:
1.  `verifyAccessToken`: This checks for a valid JSON Web Token (JWT) in the `Authorization: Bearer <token>` header.
2.  `requireAdmin`: This middleware runs after `verifyAccessToken` and checks if the authenticated user has a `role` property set to `'admin'`.

### How to Create an Admin User

For development purposes, you can manually assign the admin role to a user in your MongoDB database.

1.  **Register a new user** through the standard user-side API.
2.  **Connect to your MongoDB database** using a tool like MongoDB Compass or the `mongo` shell.
3.  **Find the user** in the `users` collection.
4.  **Update their document** to set the `role` field to `"admin"`:

```sh
# Example using mongosh
db.users.updateOne(
  { "email": "your-email@example.com" },
  { $set: { "role": "admin" } }
)
```

Once the user has the 'admin' role, generate a JWT for them using the login endpoint and use that token for all requests to the admin API.

## 3. API Endpoints

### Get Recent Orders

This is the primary endpoint for the admin dashboard to view, filter, and search for orders.

-   **Endpoint**: `GET /api/admin/orders/recent`
-   **Access**: `Admin`

#### Query Parameters:

| Parameter     | Type      | Description                                                               | Example                                    |
|---------------|-----------|---------------------------------------------------------------------------|--------------------------------------------|
| `page`        | `Number`  | The page number for pagination. Defaults to `1`.                          | `?page=2`                                  |
| `limit`       | `Number`  | The number of items to return per page. Defaults to `10`.                 | `?limit=20`                                |
| `status`      | `String`  | Filter by order status.                                                   | `?status=pending`                          |
| `platform`    | `String`  | Filter by the platform the order was placed on.                           | `?platform=app`                            |
| `serviceType` | `String`  | Filter by the type of service requested.                                  | `?serviceType=iron+only`                   |
| `q`           | `String`  | Search term for `orderId`, customer `fullname`, or `phonenumber`. Case-insensitive. | `?q=ORD123` or `?q=Jane+Doe`               |
| `from`        | `String`  | The start date of a date range (format: `YYYY-MM-DD`).                    | `?from=2025-01-01`                         |
| `to`          | `String`  | The end date of a date range (format: `YYYY-MM-DD`).                      | `?to=2025-01-31`                           |

#### Example Response (`200 OK`):
```json
{
  "success": true,
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "_id": "63f8c8e9b1e0a9d1b4e8b0a9",
      "orderId": "XYZ-123",
      "customer": {
        "_id": "63f8c8e9b1e0a9d1b4e8b0a0",
        "fullname": "John Doe",
        "email": "john.doe@example.com",
        "phonenumber": "1234567890"
      },
      "serviceType": "wash & fold",
      "platform": "web",
      "address": "123 Main St, Anytown, USA",
      "items": [
        {
          "name": "Standard Wash",
          "quantity": 2,
          "price": 15.00,
          "_id": "63f8c8e9b1e0a9d1b4e8b0aa"
        }
      ],
      "total": 30.00,
      "status": "pending",
      "createdAt": "2025-11-17T12:00:00.000Z",
      "updatedAt": "2025-11-17T12:00:00.000Z"
    }
  ]
}
```
