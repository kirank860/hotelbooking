
import { clerkClient } from "@clerk/express";
console.log("Type of clerkClient:", typeof clerkClient);
console.log("Keys of clerkClient:", Object.keys(clerkClient));
console.log("clerkClient.users:", clerkClient.users);
if (clerkClient.users && typeof clerkClient.users.getUser === 'function') {
    console.log("clerkClient.users.getUser is a function");
} else {
    console.log("clerkClient.users.getUser is NOT a function");
}
