
import { clerkClient } from "@clerk/express";
console.log("clerkClient:", clerkClient);
if (clerkClient && clerkClient.users) {
    console.log("clerkClient.users exists");
} else {
    console.log("clerkClient.users MISSING");
}
