// // types/express.d.ts
// import "express";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         role?: string;
//         email?: string;
//       };
//       file?: Multer.File;
//     }
//     interface Request {
//       user?: User
//     }
//   }
// }

// export {};


import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role?: "user" | "technician" | "admin";
      email?: string;
    }

    interface Request {
      user: UserPayload;
    }
  }
}

export {};
